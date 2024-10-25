import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("CONNECTION SUCCESSFUL FROM NATS");

  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };

  const jsonData = JSON.stringify(data);
  stan.publish("ticket:created", jsonData, () => {
    console.log("Event Published");
  });
});
