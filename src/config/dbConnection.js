import mongoose from 'mongoose';

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connected')
    } catch (error) {
        console.error('Error connecting to database:', error.message)
        process.exit(1)
    }
}

export default db

