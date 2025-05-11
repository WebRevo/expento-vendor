import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Filter, Grid, List, Edit2, Trash2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

type Product = {
  product_id: string;
  details: {
    name: string;
    price: number;
    description: string;
    stock_quantity: number;
    image_url: string[] | Array<{
      url: string;
      color: string;
    }>;
  };
  created_at: string;
  approved: boolean;
  image: any[];
  uploaded_by: string;
};

const ProductList = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [categories, setCategories] = useState<{ Category_id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Check authenticated user on component mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        navigate('/login');
      }
    };
    
    checkUser();
  }, [navigate]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filterCategory, userId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('Category_id, name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    if (!userId) {
      setLoading(false);
      setProducts([]);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase.from('products')
        .select('*')
        .eq('uploaded_by', userId);
      
      // Apply category filter if selected
      if (filterCategory && filterCategory !== 'all') {
        query = query.eq('Category_id', filterCategory);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform database response to match Product type
      const transformedProducts = (data || []).map(item => ({
        product_id: item.product_id,
        created_at: item.created_at,
        approved: !!item.approved,
        image: item.image || [],
        uploaded_by: item.uploaded_by || '',
        details: item.details as Product['details'] || {
          name: '',
          price: 0,
          description: '',
          stock_quantity: 0,
          image_url: []
        }
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Start delete process (open confirmation dialog)
  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  // Delete product function after confirmation
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', productToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset state
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Navigate to product detail view
  const viewProductDetail = (productId: string) => {
    navigate(`/dashboard/products/${productId}`);
  };

  // Navigate to product edit view
  const editProduct = (productId: string) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.details?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get the first image from product
  const getProductImage = (product: Product) => {
    if (!product.details?.image_url || product.details.image_url.length === 0) {
      return "/placeholder.svg";
    }

    const firstImage = product.details.image_url[0];
    
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      return firstImage.url;
    }
    
    return "/placeholder.svg";
  };

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Products</h1>
            <Button asChild>
              <Link to="/dashboard/product-upload">Add New Product</Link>
            </Button>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.Category_id} value={category.Category_id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : userId === null ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">Please log in to view your products</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">You haven't uploaded any products yet.</p>
              <Button asChild>
                <Link to="/dashboard/product-upload">Upload Your First Product</Link>
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.product_id} className="overflow-hidden flex flex-col h-full">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.details?.name || 'Product'} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg truncate">
                            {product.details?.name}
                          </CardTitle>
                          <Badge variant={product.approved ? "default" : "outline"}>
                            {product.approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <p className="text-muted-foreground line-clamp-2">
                          {product.details?.description}
                        </p>
                        <p className="mt-2 font-semibold">
                          ${product.details?.price.toFixed(2)}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => viewProductDetail(product.product_id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => editProduct(product.product_id)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => confirmDeleteProduct(product.product_id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.product_id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="h-40 md:w-48 overflow-hidden">
                          <img 
                            src={getProductImage(product)} 
                            alt={product.details?.name || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col flex-1 p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">{product.details?.name}</h3>
                            <Badge variant={product.approved ? "default" : "outline"}>
                              {product.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-2">{product.details?.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <p className="font-semibold">${product.details?.price.toFixed(2)}</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewProductDetail(product.product_id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => editProduct(product.product_id)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => confirmDeleteProduct(product.product_id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductList;
