import Subscriber from '../models/Subscriber.js';

const subscribeToNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(409).json({ message: 'Email is already subscribed' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        return res.status(201).json({ message: 'Successfully subscribed to the newsletter', subscriber: newSubscriber });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { subscribeToNewsletter };
