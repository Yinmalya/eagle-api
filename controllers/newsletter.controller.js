import Subscriber from "../models/subscriber.js";

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already subscribed" });

    const sub = new Subscriber({ email });
    await sub.save();
    res.status(201).json({ message: "Subscribed", subscriber: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
