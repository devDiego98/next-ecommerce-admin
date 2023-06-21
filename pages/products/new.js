import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import useAxios from "../hooks/useAxios";
import Spinner from "@/components/Spinner";
import { useState } from "react";
export default function NewProduct() {
  const {
    data: products,
    loading: loadingProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useAxios(`/api/products`, "get");
  const [existingProduct, setExistingProduct] = useState({});
  const handleAddExistingProduct = (value) => {
    if (value == "") {
      setExistingProduct({});
      return;
    }
    let newValue = JSON.parse(value);
    setExistingProduct(newValue);
  };
  return (
    <Layout pageName={"New Product"}>
      <div className="flex flex-row gap-5">
        <h1 className="text-xl text-blue-900 mb-2">New Product</h1>
        <span>or</span>
        {!loadingProducts ? (
          <div>
            <p>Update Existing Product</p>
            <select onChange={(e) => handleAddExistingProduct(e.target.value)}>
              <option value="">-Select-</option>
              {products?.map((product) => {
                return (
                  <option value={JSON.stringify(product)}>
                    {product.name}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="m-auto">
            <Spinner></Spinner>
          </div>
        )}
      </div>

      <ProductForm item={existingProduct} />
    </Layout>
  );
}
