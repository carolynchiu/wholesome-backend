const productsModel = require('../models/products')

// 商品列表頁
async function getProductList(req, res, next){

    let category = req.query.category;
    req.query.search !== undefined ? search=`%${req.query.search}%` : search='%%'; 
   
    console.log('search', search)
    let page = req.query.page || 1;
    console.log('category', category, 'page', page)

    let order = req.query.order
    console.log('order',order)

    

    //每一列表頁有幾筆資料
    const perPage = 18;

    //總筆數
    
    if (category === "植物奶" || category === "有機蔬果汁" || category === "營養點心") {
         total = await productsModel.mainAmountByProductId(category,search)
         console.log(total);

    } else {
         total = await productsModel.subAmountByProductId(category, search)
         console.log(total);
    }
     

    
    let totalPage = Math.ceil(total / perPage);

    // 計算offset
    const offset = perPage * (page - 1)

   
  
    if (category === "植物奶"||category === "有機蔬果汁" || category === "營養點心") {

        switch(order){
            case "價錢由高到低":
                data = await productsModel.getMainCategoryProductsOrder1(category,search,  perPage, offset)
                break;
            case "價錢由低到高":
                data = await productsModel.getMainCategoryProductsOrder2(category,search,  perPage, offset)
                break;
            case "上市日期由新到舊":
                data = await productsModel.getMainCategoryProductsOrder3(category,search,  perPage, offset)
                break;
            case "上市日期由舊到新":
                data = await productsModel.getMainCategoryProductsOrder4(category,search,  perPage, offset)
                break;
            default:
                data = await productsModel.getMainCategoryProducts(category,search,  perPage, offset)
                break;
        }
            

        
         
    } else {

        switch(order){
            case "價錢由高到低":
                data = await productsModel.getSubCategoryProductsOrder1(category,search, perPage, offset)
                break;
            case "價錢由低到高":
                data = await productsModel.getSubCategoryProductsOrder2(category,search, perPage, offset)
                break;
            case "上市日期由新到舊":
                data = await productsModel.getSubCategoryProductsOrder3(category,search, perPage, offset)
                break;
            case "上市日期由舊到新":
                data = await productsModel.getSubCategoryProductsOrder4(category,search, perPage, offset)
                break;
            default:
                data = await productsModel.getSubCategoryProducts(category,search, perPage, offset)
                break;
        }
         
        
    }
    
    // console.log('allData',data)

    
    
    
    res.json({
        pagination:{
            total,
            perPage,
            page,
            totalPage,
        },
        data,
    })
}


module.exports= {getProductList};
