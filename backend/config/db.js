import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;