import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.id === "name" ||
      e.target.id === "description" ||
      e.target.id === "address" ||
      e.target.id === "bedrooms" ||
      e.target.id === "bathrooms" ||
      e.target.id === "regularPrice" ||
      e.target.id === "discountedPrice"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least 1 image");
      if (formData.regularPrice < formData.discountedPrice)
        return setError(
          "Discounted price must be lower than the Regular Price"
        );
      setLoading(true);
      setError(false);

      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      console.log(data);
      setFormData(data);
      console.log(formData);
    };

    fetchListing();
  }, []);
  console.log(JSON.stringify(formData));

  return (
    <main className="p-3 mt-4 max-w-4xl mx-auto border rounded-lg">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <Input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <Input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <Input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between mx-auto gap-5">
              <div className="flex gap-2 items-center">
                <Input
                  type="checkbox"
                  className="w-5"
                  id="sale"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="checkbox"
                  className="w-5"
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Input
                  type="checkbox"
                  className="w-5"
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="checkbox"
                  className="w-5"
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="checkbox"
                  className="w-5"
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className=" flex justify-between">
              <div className="flex items-center gap-2">
                <Input
                  className=""
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  className=""
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    className=""
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="1000000"
                    required
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                </div>
                <div className="flex flex-col items-center w-40">
                  <p>Regular Price</p>
                  <span className="text-xs">( $ / month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Input
                      className=""
                      type="number"
                      id="discountedPrice"
                      min="0"
                      max="1000000"
                      required
                      onChange={handleChange}
                      value={formData.discountedPrice}
                    />
                  </div>
                  <div className="flex flex-col items-center w-40">
                    <p>Discounted Price</p>
                    <span className="text-xs">( $ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <Input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="rounded w-full"
            />
            {/* <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-2 border border-green-2 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button> */}
            <Button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <p className="text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center "
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                {/* <button
                  className="p-3 text-red-1 rounded-lg uppercase hover:opacity-75"
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button> */}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
          {/* <button
            disabled={loading || uploading}
            className="p-3 bg-grey-slate-3 text-white-1 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Update Listing"}
          </button> */}
          <Button disabled={loading || uploading}>
            {loading ? "Updating..." : "Update Listing"}
          </Button>
          {error && <p className="text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
