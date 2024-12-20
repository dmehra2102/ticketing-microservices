import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener COnnect to NATS server");

  stan.on("close", () => {
    console.log("NATS connnection closed!");
    process.exit();
  });
  const options = stan.subscriptionOptions().setManualAckMode(true);

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (data: Message) => {
    const payLoadData = data.getData();
    if (typeof payLoadData === "string") {
      console.log(`${payLoadData}`);
    }
    console.log("Message received");

    data.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  private client: Stan;
  abstract onMessage: (data: any, msg: Message) => void;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message recieved : ${this.subject} / ${this.queueGroupName}`
      );
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
