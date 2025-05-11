import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, ArrowLeft } from "lucide-react";

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
  uploaded_by: string;
  image: any[];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate('/login');
        return;
      }
      setUserId(session.user.id);
      fetchProduct();
    };
    checkUser();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', id)
        .single();
      
      if (error) throw error;
      
      // Transform to Product type
      const transformedProduct = {
        product_id: data.product_id,
        created_at: data.created_at,
        approved: !!data.approved,
        uploaded_by: data.uploaded_by || '',
        image: data.image || [],
        details: data.details as Product['details'] || {
          name: '',
          price: 0,
          description: '',
          stock_quantity: 0,
          image_url: []
        }
      };
      
      setProduct(transformedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product details. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', product.product_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProductImages = () => {
    if (!product?.details?.image_url || product.details.image_url.length === 0) {
      return ["/placeholder.svg"];
    }

    return product.details.image_url.map((image) => {
      if (typeof image === 'string') {
        return image;
      } else if (image && typeof image === 'object' && 'url' in image) {
        return image.url;
      }
      return "/placeholder.svg";
    });
  };

  const images = product ? getProductImages() : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">Product not found.</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const isOwner = userId && product.uploaded_by === userId;

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/products')} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4">
              <div className="relative aspect-square overflow-hidden rounded-md border">
                {images.length > 0 && (
                  <img
                    src={images[currentImageIndex]}
                    alt={product.details?.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                )}
                
                {images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80"
                      onClick={prevImage}
                    >
                      &larr;
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80"
                      onClick={nextImage}
                    >
                      &rarr;
                    </Button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-auto pb-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded border h-16 w-16 overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Product thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold">
                    {product.details?.name}
                  </CardTitle>
                  <Badge variant={product.approved ? "default" : "outline"}>
                    {product.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="px-0 space-y-4">
                <div>
                  <p className="text-2xl font-bold">
                    ${product.details?.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {product.details?.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Stock</h3>
                  <p className="text-muted-foreground">
                    {product.details?.stock_quantity} units available
                  </p>
                </div>
              </CardContent>

              {isOwner && (
                <CardFooter className="px-0 pt-4 flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/dashboard/products/edit/${product.product_id}`)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </Button>
                </CardFooter>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteProduct();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
