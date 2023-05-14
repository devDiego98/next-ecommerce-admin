import Category from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    res.status(200).json(await Category.deleteOne({ _id: req.query.id[0] }));
  }
}
