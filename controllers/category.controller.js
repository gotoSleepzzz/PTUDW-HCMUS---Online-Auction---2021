import Category from '../models/category.model.js';


const categoryController = {
    getAll: async (req, res) => {

        const categories = await Category.find({}).lean();
        res.render('management-category', {
            layout: 'admin',
            categories
        })
    },
    getById: async (req, res) => {
        const id = req.query.id;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({});
        } else {
            res.status(200).send({});
        }
    },


    create: async (req, res) => {
        const category = new Category({
            name: req.body.name,
        });
        // check that the category is unique
        const categoryExists = await Category.findOne({name: category.name});
        if (categoryExists) {
            res.status(400).send({message: false});
        } else {
            await category.save();
            res.status(200).send({message: true});
        }
    },

    deleteCategory: async (req, res) => {
        const id = req.body.id;
        const category = await Category.findById(id);

        if (!category) {
            res.status(404).send({
                message: false
            });
        } else {
            // check that amount of products in category is 0

            if (category.amount === 0) {
                await category.remove();
                res.status(200).send({
                    message: true

                });
            } else {
                res.status(400).send({
                    message: false
                });
            }
        }
    },
    update: async (req, res) => {
        const id = req.body.id;
        const category = await Category.findById(id);

        if (!category) {
            res.status(404).send({
                message: false
            });
        } else {
            category.name = req.body.name;
            await category.save();
            res.status(200).send({
                message: true
            });
        }
    },

    createSubCategory: async (req, res) => {

        const id = req.body.id;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({
                message: 'Category not found with id ' + id
            });
        } else {
            // check that subcategory is unique which sub category in array subCat
            console.log(category.subCat);
            const subCategoryExists = category.subCat.find(subCategory => subCategory === "" + req.body.name);
            if (subCategoryExists) {
                res.status(400).send({message: false});
            } else {
                category.subCat.push(req.body.name);
                category.save();
                res.status(200).send({message: true});
            }
        }
    },


    removeSubcategory: async (req, res) => {
        const id = req.body.id;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({
                message: false
            });
        } else {
            const index = category.subCat.indexOf(req.body.name);
            if (index > -1) {
                category.subCat.splice(index, 1);
                await category.save();
                res.status(200).send({
                    message: true
                });
            } else {
                res.status(400).send({
                    message: false
                });
            }
        }
    },
    updateSubcategory : async(req, res) => {
        // find category
        const id = req.body.id;
        const category = await Category.findById(id);

        // find subcategory
        const subCategory = category.subCat.find(subCategory => subCategory === "" + req.body.name);
        if (!category) {
            res.status(404).send({
                message: false
            });
        } else {
            const index = category.subCat.indexOf(subCategory);
            if (index > -1) {
                category.subCat[index] = req.body.newName;
                await category.save();
                res.status(200).send({
                    message: true
                });
            } else {
                res.status(400).send({
                    message: false
                });
            }
        }
    }
}

export default categoryController;