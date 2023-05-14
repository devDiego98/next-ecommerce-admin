import Product from "@/models/Product";

export default async function handler(req, res) {
  const { method } = req;
  if (method === "DELETE") {
    res.status(200).json(await Product.deleteOne({ _id: req.query.id[0] }));
  }
}
