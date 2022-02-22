const express = require('express');
const router = express.Router();
const controllerCategory = require("../controller/controllerCategory")

router.get('/',controllerCategory.list);
router.get('/:id/edit',controllerCategory.edit);
router.put('/:id/edit',controllerCategory.editProcess);
router.get('/add',controllerCategory.add);
router.post('/add',controllerCategory.addProcess);

module.exports = router;