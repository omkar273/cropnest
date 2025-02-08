import mongoose from 'mongoose';

const connectMongodb = async () => {
    try {
        const mongoUri = process.env.MOGODB_URI;
        const dbName = process.env.DB_NAME;

        if (!mongoUri || !dbName) {
            throw new Error(
                'MongoDB URI or Database name is not defined in environment variables.'
            );
        }

        const fullUri = `${mongoUri}/${dbName}?retryWrites=true&w=majority`;
        console.log('MongoDB Connection URI:', fullUri);

        const connection = await mongoose.connect(fullUri);

        console.log(`MongoDB connected: ${connection.connection.host}`);

        connection.connection.on('error', (error) => {
            console.error('MongoDB Connection Error:', error);
        });
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
};

export default connectMongodb;
