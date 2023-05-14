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
    let allCategories = await Category.find();
    let allData = await Promise.all(
      allCategories.map(async (category) => {
        let parentCategory;
        if (category.parentCategory._id) {
          parentCategory = await Category.findById(category.parentCategory._id);
          let obj = {
            ...category.toObject(),
            parentCategory: parentCategory,
          };
          return obj;
        }
        return category;
      })
    );
    res.status(200).json(allData);
  }

  if (method === "PUT") {
    let {
      name,
      parentCategoryField: parentCategory,
      _id,
      properties,
    } = req.body;

    res.status(200).json(
      await Category.updateOne(
        { _id },
        {
          name,
          parentCategory:
            parentCategory._id === ""
              ? { name: undefined, _id: undefined }
              : parentCategory,
          properties,
        }
      )
    );
  }
}
