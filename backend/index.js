import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from 'multer';
import bcrypt from 'bcrypt';
import path from 'path';

const App = express()
App.use(express.json())
App.use(express.urlencoded())
App.use(cors());

App.use("/uploads", express.static("uploads")); // Serve static files


// Connect to MongoDB(for checking connection with backend)
mongoose.connect('mongodb+srv://isha:vIu5A8sCvdhnyhP9@supplychain.aroeqjn.mongodb.net/?retryWrites=true&w=majority&appName=supplychain',
  { useNewUrlParser: true }
)

  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Any code that depends on the database connection should go here
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });



const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const distributorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const retailorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const consumerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

// const productSchema = new mongoose.Schema({
//   productId: String,
//   name: String,
//   location: String,
//   quantity: Number,
//   price: Number,
//   productName: String,
//   batchNo: Number,
//   mfgDate: String,
//   expiryDate: String,
//   image: String, // Store image filename
// });


const Farmer = new mongoose.model("Farmer", farmerSchema);
const Distributor = new mongoose.model("Distributor", distributorSchema);
const Retailor = new mongoose.model("Retailor", retailorSchema);
const Consumer = new mongoose.model("Consumer", consumerSchema);
// const Product = mongoose.model('Product', productSchema);


// Farmer Schema
const farmerProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  location: String,
  quantity: Number,
  price: Number,
  productName: String,
  batchNo: Number,
  mfgDate: String,
  expiryDate: String,
  imageUrl: String,
});
// Distributor Schema
const distProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  location: String,
  quantity: Number,
  price: Number,
  productName: String,
  batchNo: Number,
  transportMethod: String,
  imageUrl: String,
});
// retailor Schema
const retProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  location: String,
  quantity: Number,
  price: Number,
  productName: String,
  batchNo: Number,
  transportMethod: String,
  imageUrl: String,
});

const FarmerProduct = mongoose.model("FarmerProduct", farmerProductSchema);
const distProduct = mongoose.model("distProduct", distProductSchema);
const retProduct = mongoose.model("retProduct", retProductSchema);



App.post("/FARMER/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(409).send({ success: false, message: "Farmer already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new farmer
    const newFarmer = new Farmer({
      name,
      email,
      password: hashedPassword,
    });

    await newFarmer.save();

    return res.status(201).send({ success: true, message: "Successfully registered. Please login now" });

  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

// for login farmer
App.post("/FARMER/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.send({ success: false, message: "Farmer not registered" }); // ✅ Add success: false
    }
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (isMatch) {
      return res.send({ success: true, message: "Login successful", farmer }); // ✅ Add success: true
    } else {
      return res.send({ success: false, message: "Password didn't match" }); // ✅ Add success: false
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message }); // ✅ Add success: false
  }
});

//distributor register
App.post("/DISTRIBUTOR/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if distributor already exists
    const existingDistributor = await Distributor.findOne({ email });
    if (existingDistributor) {
      return res.status(409).send({ success: false, message: "Distributor already registered" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save new distributor
    const newDistributor = new Distributor({
      name,
      email,
      password: hashedPassword,
    });

    await newDistributor.save();
    return res.status(201).send({ success: true, message: "Successfully registered. Please login now" });

  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

// for login distributor
App.post("/DISTRIBUTOR/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if distributor exists
    const distributor = await Distributor.findOne({ email });
    if (!distributor) {
      return res.status(404).json({ success: false, message: "Distributor not registered" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, distributor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Remove password before sending response for security
    const { password: _, ...distributorData } = distributor.toObject();

    // Send successful response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      distributor: distributorData, // Send distributor info (without password)
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

//retailor register
App.post("/RETAILOR/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if retailer already exists
    const existingRetailor = await Retailor.findOne({ email });
    if (existingRetailor) {
      return res.status(409).send({ success: false, message: "Retailor already registered" }); // ✅ Add success: false
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new retailer
    const newRetailor = new Retailor({
      name,
      email,
      password: hashedPassword,
    });

    await newRetailor.save();

    return res.status(201).send({ success: true, message: "Successfully registered. Please login now" }); // ✅ Add success: true

  } catch (error) {
    return res.status(500).send({ success: false, error: error.message }); // ✅ Add success: false
  }
});


// for login retailor
App.post("/RETAILOR/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const retailor = await Retailor.findOne({ email });
    if (!retailor) {
      return res.send({ success: false, message: "Retailor not registered" }); // ✅ Add success: false
    }

    const isMatch = await bcrypt.compare(password, retailor.password);
    if (isMatch) {
      return res.send({ success: true, message: "Login successful", retailor }); // ✅ Add success: true
    } else {
      return res.send({ success: false, message: "Password didn't match" }); // ✅ Add success: false
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message }); // ✅ Add success: false
  }
});

//consumer register
App.post("/CONSUMER/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingConsumer = await Consumer.findOne({ email });
    if (existingConsumer) {
      return res.send({ success: false, message: "Consumer already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newConsumer = new Consumer({ name, email, password: hashedPassword });

    await newConsumer.save();
    return res.send({ success: true, message: "Successfully registered. Please login now" });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

// for login consumer
App.post("/CONSUMER/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const consumer = await Consumer.findOne({ email });
    if (!consumer) {
      return res.send({ success: false, message: "Consumer not registered" });
    }

    const isMatch = await bcrypt.compare(password, consumer.password);
    if (isMatch) {
      return res.send({ success: true, message: "Login successful", consumer });
    } else {
      return res.send({ success: false, message: "Password didn't match" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

/////////////////////////////////////////////////////////////

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage })

///////////////////////////////////////////////////////////////////////
App.post("/api/farmerproducts", upload.single("image"), async (req, res) => {
  try {
    // console.log("Request received:", req.body); // ✅ Debug log
    // console.log("Uploaded Image File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const productData = JSON.parse(req.body.productData); // Parse product data
    // console.log("Parsed productData:", productData); // ✅ Debug log

    // Ensure all required fields are present
    if (!productData.productId || !productData.name || !productData.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new product entry
    const newProduct = new FarmerProduct({
      productId: productData.productId,
      name: productData.name,
      location: productData.location || "",
      quantity: productData.quantity ? Number(productData.quantity) : 0,
      price: productData.price ? Number(productData.price) : 0,
      productName: productData.productName || "",
      batchNo: productData.batchNo ? Number(productData.batchNo) : 0,
      mfgDate: productData.mfgDate || "",
      expiryDate: productData.expiryDate || "",
      imageUrl: `/uploads/${req.file.filename}`, // ✅ Save image path
    });

    const savedProduct = await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // console.log("Saved product:", savedProduct); // ✅ Debug log
    // console.log("Returning image URL:", imageUrl); // ✅ Debug log

    // ✅ Send back the complete product object with image URL
    res.status(201).json({ ...savedProduct.toObject(), imageUrl });

  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ error: "Failed to save in MongoDB" });
  }
});

//dist
App.post("/api/distproducts", upload.single("image"), async (req, res) => {
  try {
    // console.log("Request received:", req.body); // ✅ Debug log
    // console.log("Uploaded Image File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const productData = JSON.parse(req.body.productData); // Parse product data
    // console.log("Parsed productData:", productData); // ✅ Debug log

    // Ensure all required fields are present
    if (!productData.productId || !productData.name || !productData.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new product entry
    const newProduct = new distProduct({
      productId: productData.productId,
      name: productData.name,
      location: productData.location || "",
      quantity: productData.quantity ? Number(productData.quantity) : 0,
      price: productData.price ? Number(productData.price) : 0,
      productName: productData.productName || "",
      batchNo: productData.batchNo ? Number(productData.batchNo) : 0,
      transportMethod: productData.transportMethod || "",
      imageUrl: `/uploads/${req.file.filename}`, // ✅ Save image path
    });

    const savedProduct = await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // console.log("Saved product:", savedProduct); // ✅ Debug log
    // console.log("Returning image URL:", imageUrl); // ✅ Debug log

    // ✅ Send back the complete product object with image URL
    res.status(201).json({ ...savedProduct.toObject(), imageUrl });

  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ error: "Failed to save in MongoDB" });
  }
});
//ret
App.post("/api/retproducts", upload.single("image"), async (req, res) => {
  try {
    // console.log("Request received:", req.body); // ✅ Debug log
    // console.log("Uploaded Image File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const productData = JSON.parse(req.body.productData); // Parse product data
    // console.log("Parsed productData:", productData); // ✅ Debug log

    // Ensure all required fields are present
    if (!productData.productId || !productData.name || !productData.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new product entry
    const newProduct = new retProduct({
      productId: productData.productId,
      name: productData.name,
      location: productData.location || "",
      quantity: productData.quantity ? Number(productData.quantity) : 0,
      price: productData.price ? Number(productData.price) : 0,
      productName: productData.productName || "",
      batchNo: productData.batchNo ? Number(productData.batchNo) : 0,
      transportMethod: productData.transportMethod || "",
      imageUrl: `/uploads/${req.file.filename}`, // ✅ Save image path
    });

    const savedProduct = await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // console.log("Saved product:", savedProduct); // ✅ Debug log
    // console.log("Returning image URL:", imageUrl); // ✅ Debug log

    // ✅ Send back the complete product object with image URL
    res.status(201).json({ ...savedProduct.toObject(), imageUrl });

  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ error: "Failed to save in MongoDB" });
  }
});

App.listen(9002, () => {
  console.log("db started at port 9002");
});
