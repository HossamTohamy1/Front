import { Product, SizeChartRow } from '../../domain/models/product.model';
import productsJson from '../../../assets/data/products.json';

export const defaultSizeChart: SizeChartRow[] = [
  { size: 'XS', waistCm: '58–63', hipsCm: '83–88', waistIn: '23–25', hipsIn: '33–35' },
  { size: 'S', waistCm: '64–69', hipsCm: '89–94', waistIn: '25–27', hipsIn: '35–37' },
  { size: 'M', waistCm: '70–76', hipsCm: '95–100', waistIn: '27–30', hipsIn: '37–39' },
  { size: 'L', waistCm: '77–83', hipsCm: '101–106', waistIn: '30–33', hipsIn: '40–42' },
  { size: 'XL', waistCm: '84–91', hipsCm: '107–113', waistIn: '33–36', hipsIn: '42–44' },
  { size: '2XL', waistCm: '92–99', hipsCm: '114–120', waistIn: '36–39', hipsIn: '45–47' },
  { size: '3XL', waistCm: '100–108', hipsCm: '121–128', waistIn: '39–42', hipsIn: '48–50' },
];

export const products: Product[] = (productsJson as any[]).map(p => ({
  ...p,
  sizeChart: p.sizeChart || defaultSizeChart,
})) as Product[];
