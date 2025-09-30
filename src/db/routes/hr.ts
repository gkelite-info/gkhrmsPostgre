import { Router } from 'express';
import { generateToken } from '../utils/authRoutes';
import bcrypt from 'bcrypt';
import { tokenBlacklist } from "../utils/authRoutes";
import Customer from '../models/hr';
import { protect } from '../../middleware/authMiddleware';

const customer_router = Router();

customer_router.get('/', async (req, res) => {
    try {
        const getData = await Customer.findAll();

        res.status(201).send({ message: 'Fetched succesfully', getData });
        return

    } catch (error) {
        res.status(500).send({ message: 'Internal server error at Userget', error })
        return
    }
});

customer_router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customer.findOne({ where: { email } });

        if (!customer) {
            res.status(400).send({ message: 'New user? Create an account' })
            return
        }

        const isMatch = await bcrypt.compare(password, customer.password);

        if (!isMatch) {
            res.status(400).send({ message: 'Invalid password, please check' });
            return
        }

        const token = generateToken(customer.id);
        console.log(`New token for customer id ${customer.id} is :`, token);

        res.json({
            id: customer.id,
            email: customer.email,
            token,
            is_consent_filled: customer.is_consent_filled,
        });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error at Userlogin', error })
        return
    }
});

customer_router.post('/consent', protect, async (req: any, res) => {
    try {
        const customerId = req.user.id;
        await Customer.update(
            { is_consent_filled: true },
            { where: { id: customerId } }
        )

        res.json({ message: 'Consent saved successfully' })
        return

    } catch (error) {
        res.status(500).send({ message: 'Internal server error at customer_consent', error })
        return
    }
});

customer_router.post('/register', async (req, res) => {
    const { firstname, lastname, phone, email, password, country } = req.body;

    try {
        const existingUser = await Customer.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with this email" });
            return
        }
        const newCustomer = await Customer.create({
            firstname,
            lastname,
            phone,
            email,
            password,
            country,
        });

        res.status(201).json({
            message: "Customer registered successfully",
            customer: {
                id: newCustomer.id,
                firstname: newCustomer.firstname,
                lastname: newCustomer.lastname,
                email: newCustomer.email,
                phone: newCustomer.phone,
                country: newCustomer.country,
            },
        });
        return
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error at register", error });
        return;
    }
});

customer_router.post("/logout", (req, res) => {
    console.log("Authorization header:", req.headers["authorization"]);
    const token = req.headers["authorization"]?.split(" ")[1];

    if (token) {
        console.log('Dropping token is :', token);
        tokenBlacklist.push(token);
    }

    res.json({ message: "Logged out successfully", token });
});

export default customer_router;