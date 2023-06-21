import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "./hooks/useAxios";
import Spinner from "@/components/Spinner";

export default function Categories() {
  const {
    data: categories,
    loading: loadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useAxios(`/api/categories`, "get");

  const [categoryEdit, setCategoryEdit] = useState({ editting: false, id: 0 });
  const [properties, setProperties] = useState([]);
  const [parentProperties, setParentProperties] = useState([]);
  const nameField = useRef("");
  const parentCategoryField = useRef("");

  async function saveCategory(ev) {
    ev.preventDefault();
    const name = ev.target[0].value;
    let parentCategory = categories.find(
      (cat) => cat._id === ev.target[1].value
    );
    if (ev.target[1].value === "") {
      parentCategory = [];
    } else {
      parentCategory = [...parentCategory.parentCategory].concat(
        parentCategory._id
      );
    }

    await axios.post("/api/categories", {
      name,
      parentCategory,
      properties,
    });
    clearFields();
    refetchCategories();
  }

  let handleParentCategoryProperties = (id) => {
    if (!id) return;
    let currentCat = categories.find((category) => category._id === id);
    let mergedProperties = [];

    for (let x = 0; x < currentCat.parentCategory.length; x++) {
      let parent = categories.find(
        (category) => category._id === currentCat.parentCategory[x]
      );
      mergedProperties.push(...parent.properties);
    }
    setParentProperties(mergedProperties);
    console.log(mergedProperties);
    return mergedProperties;
  };

  const setEditableCategory = async (values) => {
    setCategoryEdit({ editting: true, id: values._id });
    setFields(values);
  };

  const setFields = (values) => {
    if (values?.parentCategory?.length) {
      parentCategoryField.current.value =
        values.parentCategory[values.parentCategory.length - 1];
    } else {
      parentCategoryField.current.value = "";
    }

    nameField.current.value = values.name;
    let parentProps = handleParentCategoryProperties(values?._id);
    setParentProperties(parentProps || []);
    setProperties(values.properties);
  };

  function clearFields() {
    setCategoryEdit({ editting: false, id: 0 });
    setProperties([]);
    setParentProperties([]);
    nameField.current.value = "";
    parentCategoryField.current.value = "";
  }

  async function deleteCategory(id, name) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${name}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/categories/${id}`);
        refetchCategories();
      }
    });
  }

  const addNewProperty = () => {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  };

  const handleRemoveProperty = (ind) => {
    setProperties((prevArray) => {
      let test = prevArray.filter((_, index) => index !== ind);
      return test;
    });
  };

  const handlePropertyNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (index, property, values) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = values;
      return properties;
    });
  };

  return (
    <Layout pageName={"Categories"}>
      <h1>Categories</h1>
      <form onSubmit={saveCategory}>
        <label>New category name</label>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Category Name"
              ref={nameField}
            ></input>
            <select
              className="mb-00"
              ref={parentCategoryField}
              onChange={(ev) => {
                handleParentCategoryProperties(ev.target.value);
              }}
            >
              <option value={""}>No parent category</option>
              {categories?.map((category) => (
                <option
                  key={category._id}
                  data-properties={JSON.stringify(category.properties)}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label>Properties</label>
            <button
              type="button"
              className="bg-gray-500 mb-2 px-2 py-1 rounded-md text-small text-white"
              onClick={() => addNewProperty()}
            >
              Add new property
            </button>
            <div className="flex flex-col mb-3">
              <p>Parent Properties</p>
              {parentProperties.length > 0 ? (
                parentProperties.map((property, index) => {
                  return (
                    <div className="flex gap-2 my-1" key={index}>
                      <input
                        readOnly
                        type="text"
                        placeholder="property name"
                        value={property.name}
                        onChange={(ev) =>
                          handlePropertyNameChange(
                            index,
                            property,
                            ev.target.value
                          )
                        }
                      />
                      <input
                        readOnly
                        type="text"
                        placeholder="values,comma separated"
                        value={property.values}
                        onChange={(ev) =>
                          handlePropertyValuesChange(
                            index,
                            property,
                            ev.target.value
                          )
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <div>No parent properties</div>
              )}
            </div>
            {properties.map((property, index) => {
              return (
                <div className="flex gap-2 my-1" key={index}>
                  <input
                    type="text"
                    placeholder="property name"
                    value={property.name}
                    onChange={(ev) =>
                      handlePropertyNameChange(index, property, ev.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="values,comma separated"
                    value={property.values}
                    onChange={(ev) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        ev.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="bg-red-500 px-3 py-1 rounded"
                    onClick={() => handleRemoveProperty(index)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          {categoryEdit.editting ? (
            <div className="flex">
              <button
                type="button"
                className="btn-primary py-1"
                onClick={async () => {
                  let parent = categories.find(
                    (category) =>
                      category._id === parentCategoryField.current.value
                  );
                  let newParenteCateries = [...parent.parentCategory];
                  newParenteCateries.push(parent._id);

                  let body = {
                    _id: categoryEdit.id,
                    name: nameField.current.value,
                    parentCategory: newParenteCateries,
                    properties: properties,
                  };
                  body.properties = properties.map((property) => ({
                    name: property.name,
                    values:
                      typeof property.values === "string"
                        ? property.values.split(",")
                        : property.values,
                  }));
                  await axios.put("/api/categories", body);
                  refetchCategories();
                  clearFields();
                  setCategoryEdit({ editting: false, id: 0 });
                }}
              >
                Update
              </button>
              <button
                className="ml-2 btn-secondary py-1 bg-red-500 px-5 rounded-lg text-white"
                onClick={clearFields}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn-primary py-1">Save</button>
          )}
        </div>
      </form>
      {!loadingCategories ? (
        <table className="basic">
          <thead>
            <tr>
              <th>Category Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category._id}>
                <td>{category?.name}</td>
                <td className="actions">
                  <button
                    onClick={() => {
                      setEditableCategory(category);
                    }}
                  >
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit{" "}
                  </button>
                  <button
                    className="trash"
                    onClick={() => deleteCategory(category._id, category.name)}
                  >
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="m-auto">
          <Spinner></Spinner>
        </div>
      )}
    </Layout>
  );
}
