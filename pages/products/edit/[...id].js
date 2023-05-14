import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState();
  useEffect(() => {
    id &&
      axios.get(`/api/products?id=` + id).then((res) => {
        setItem(res.data);
      });
  }, [id]);

  return (
    <Layout pageName={"Edit Product"}>
      <h1>Edit Product</h1>
      <ProductForm item={item} />
    </Layout>
  );
}
