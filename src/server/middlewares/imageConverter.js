const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const {
  uploadBytes,
  ref,
  getDownloadURL,
  getStorage,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBcffgne_H-E6UMB2BYnfhojP9mWVLWYQA",
  authDomain: "images-af588.firebaseapp.com",
  projectId: "images-af588",
  storageBucket: "images-af588.appspot.com",
  messagingSenderId: "989226133051",
  appId: "1:989226133051:web:25d56a56df180132c81e1e",
};

const firebaseApp = initializeApp(firebaseConfig);

const imageConverter = async (req, res, next) => {
  const { file } = req;

  let firebaseFileURL;

  if (file) {
    const newImageName = file ? `${Date.now()}${file.originalname}` : "";
    await fs.rename(
      path.join("uploads", "pizzerias", file.filename),
      path.join("uploads", "pizzerias", newImageName),
      async (error) => {
        if (error) {
          next(error);
          return;
        }

        await fs.readFile(
          path.join("uploads", "pizzerias", newImageName),
          async (readError, readFile) => {
            if (readError) {
              next(readError);
              return;
            }
            const storage = getStorage(firebaseApp);

            const storageRef = ref(storage, newImageName);

            const metadata = {
              contentType: "image",
            };

            await uploadBytes(storageRef, readFile, metadata);
            firebaseFileURL = await getDownloadURL(storageRef);

            req.newImageName = newImageName;
            req.firebaseFileURL = firebaseFileURL;

            if (firebaseFileURL) {
              next();
            }
          }
        );
      }
    );
    if (firebaseFileURL) {
      next();
    }
  } else {
    next();
  }
};

module.exports = imageConverter;
