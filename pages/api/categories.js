import Category from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    let parentData;
    if (parentCategory._id) {
      parentData = await Category.findById(parentCategory._id);
    }
    let newCat = await Category.create({
      name: name,
      parentCategory: parentCategory,
      properties: properties.length > 0 ? properties : undefined,
    });
    res.status(200).json(newCat);
  }

  if (method === "GET") {
    try {
      let allCategories = await Category.find();
      res.status(200).json(allCategories);
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === "PUT") {
    let { name, parentCategory, _id, properties } = req.body;

    res.status(200).json(
      await Category.updateOne(
        { _id },
        {
          name,
          parentCategory: parentCategory.length === 0 ? [] : parentCategory,
          properties,
        }
      )
    );
  }
}
