const categoryMen = '/assets/home/category-men-hd.png';
const categoryPostpartum = '/assets/home/category-postpartum-hd.png';
const categorySport = '/assets/home/category-sport-hd.png';
const categoryWomen = '/assets/home/category-women-hd.png';

const productClassicBlack = '/assets/home/product-classic-black-hd.png';
const productBeigeSquare = '/assets/home/product-beige-square-hd.png';
const productSportBlack = '/assets/home/product-sport-black-hd.png';
const productPostpartumBeige = '/assets/home/product-postpartum-beige-hd.png';
const productFullBody = '/assets/home/product-full-body-hd.png';

export type HomeCategory = {
    id: string
    label: string
    image: string
    path: string
}

export type HomeProduct = {
    id: string
    productId: string
    name: string
    image: string
    price: number
    oldPrice: number
    rating: number
    reviews: number
    discount?: number
}

export const homeCategories: HomeCategory[] = [
    {
        id: 'women',
        label: 'COMMON.WOMENS',
        image: categoryWomen,
        path: '/categories',
    },
    {
        id: 'sport',
        label: 'COMMON.SPORTS',
        image: categorySport,
        path: '/categories',
    },
    {
        id: 'postpartum',
        label: 'COMMON.POSTPARTUM',
        image: categoryPostpartum,
        path: '/categories',
    },
    {
        id: 'men',
        label: 'COMMON.MENS',
        image: categoryMen,
        path: '/categories',
    },
]

export const homeProducts: HomeProduct[] = [
    {
        id: 'home-product-1',
        productId: 'prod-2',
        name: 'PRODUCT.FULL_BODY_SHAPER',
        image: productFullBody,
        price: 260,
        oldPrice: 320,
        rating: 4.9,
        reviews: 112,
    },
    {
        id: 'home-product-2',
        productId: 'prod-3',
        name: 'PRODUCT.POSTPARTUM_SHAPER',
        image: productPostpartumBeige,
        price: 210,
        oldPrice: 250,
        rating: 4.8,
        reviews: 96,
    },
    {
        id: 'home-product-3',
        productId: 'prod-4',
        name: 'PRODUCT.SPORTS_SHAPER',
        image: productSportBlack,
        price: 230,
        oldPrice: 270,
        rating: 4.7,
        reviews: 86,
        discount: 15,
    },
    {
        id: 'home-product-4',
        productId: 'prod-6',
        name: 'PRODUCT.DAILY_SQUARE_SHAPER',
        image: productBeigeSquare,
        price: 195,
        oldPrice: 250,
        rating: 4.7,
        reviews: 96,
    },
    {
        id: 'home-product-5',
        productId: 'prod-1',
        name: 'PRODUCT.CLASSIC_WAIST_SHAPER',
        image: productClassicBlack,
        price: 200,
        oldPrice: 250,
        rating: 4.8,
        reviews: 126,
        discount: 20,
    },
]
