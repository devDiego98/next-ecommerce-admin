import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const newProductSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  desc: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  category: Yup.string().required("Required"),
});

export default function ProductForm({ item = {} }) {
  const [images, setImages] = useState(item?.images || []);
  const [categories, setCategories] = useState([]);
  const [isUploading, setisUploading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyValues, setPropertyValues] = useState({});

  const fetchCategories = async () => {
    const cats = await axios.get("/api/categories");
    setCategories(cats.data);
  };
  useEffect(() => {
    if (Object.keys(item).length == 0) {
      setImages([]);
    } else {
      item?.images && setImages(item.images);
    }
    console.log(item);
  }, [item]);
  useEffect(() => {
    item && setPropertyValues(item?.properties || {});
  }, [item, categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveProduct = async (data) => {
    data.images = images;
    data.properties = { ...propertyValues };
    if (item?._id) {
      await axios.put("/api/products", data);
    } else {
      await axios.post("/api/products", data);
    }
    // router.push("/products");
  };
  const uploadImages = async (ev) => {
    setisUploading(true);
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setisUploading(false);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: item?.name || "",
        desc: item?.desc || "",
        price: item?.price || 0,
        category:
          (item?.category && item?.category[item?.category?.length - 1]) || "",
      }}
      validationSchema={newProductSchema}
      onSubmit={(values) => {
        // same shape as initial values
        saveProduct(values);
      }}
    >
      {({ errors, touched, handleChange }) => (
        <Form className="w-full flex flex-col gap-4">
          <div>
            <label htmlFor="name">Product Name</label>
            <Field name="name" id="name" />
            {errors.name && touched.name ? (
              <div className="error">{errors.name}</div>
            ) : null}
          </div>
          <div className="flex gap-3">
            <label className="cursor-pointer rounded-lg bg-gray-200 text-gray-500 w-24 h-24 border flex items-center flex-col justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Upload
              <input type="file" className="hidden" onChange={uploadImages} />
            </label>
            {isUploading && (
              <div className="h-24 flex justify-center items-center mx-5">
                <Spinner></Spinner>
              </div>
            )}
            <ReactSortable
              list={images}
              setList={setImages}
              className="flex gap-3 flex-wrap"
            >
              {images?.length > 0 &&
                images.map((link, index) => (
                  <img
                    key={link + index}
                    className="w-24 h-24  rounded-lg flex justify-center items-center cursor-grab"
                    src={link}
                  />
                ))}
            </ReactSortable>
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <Field name="desc" id="desc" />
            {errors.desc && touched.desc ? (
              <div className="error"> {errors.desc}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <Field name="price" type="number" id="price" />
            {errors.price && touched.price ? (
              <div className="error">{errors.price}</div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <label htmlFor="category">Category</label>
            <Field
              as="select"
              name="category"
              onChange={(ev) => {
                console.log(ev.target.value);
                handleChange(ev);
                setPropertyValues({});
              }}
            >
              <option value="" key="">
                Uncategorized
              </option>
              {categories?.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </Field>
            {errors.category && touched.category ? (
              <div className="error">{errors.category}</div>
            ) : null}
          </div>
          {properties.map((property, index) => {
            return (
              <div className="mx-8" key={property.name + index}>
                <label>{property.name}</label>
                <select
                  key={property.name + index}
                  defaultValue={propertyValues[property?.name] || ""}
                  name={property.name}
                  onChange={(ev) => {
                    setPropertyValues((prev) => {
                      if (ev.target.selectedOptions[0].value === "") {
                        let newState = { ...propertyValues };
                        let propertyName = property.name;
                        if (newState[propertyName]) {
                          delete newState[propertyName];
                        }
                        setPropertyValues(newState);
                      } else {
                        return {
                          ...prev,
                          [property.name]: ev.target.selectedOptions[0].value,
                        };
                      }
                    });
                  }}
                >
                  <option value="">- select -</option>
                  {property.values.map((value, index) => (
                    <option value={value.toLowerCase()} key={value + index}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          <button type="submit" className="btn-primary mt-2 w-32 m-auto">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
