import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout pageName={"New Product"}>
      <h1 className="text-xl text-blue-900 mb-2">New Product</h1>
      <ProductForm />
    </Layout>
  );
}
