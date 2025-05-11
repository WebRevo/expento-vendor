
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

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
};

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        // Redirect if not authenticated
        navigate('/dashboard/products');
      }
    };
    
    checkUser();
    fetchProduct();
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
        details: data.details as Product['details'] || {
          name: '',
          price: 0,
          description: '',
          stock_quantity: 0,
          image_url: []
        }
      };
      
      setOriginalProduct(transformedProduct);
      
      // Set form values
      setName(transformedProduct.details.name);
      setPrice(transformedProduct.details.price);
      setDescription(transformedProduct.details.description);
      setStockQuantity(transformedProduct.details.stock_quantity);
      
      // Check if user owns this product
      if (transformedProduct.uploaded_by && userId && transformedProduct.uploaded_by !== userId) {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to edit this product",
          variant: "destructive",
        });
        navigate('/dashboard/products');
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalProduct) return;
    
    setSaving(true);
    try {
      // Create updated product with the modified details
      const updatedDetails = {
        ...originalProduct.details,
        name,
        price,
        description,
        stock_quantity: stockQuantity
      };
      
      const { error } = await supabase
        .from('products')
        .update({ 
          details: updatedDetails
        })
        .eq('product_id', originalProduct.product_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      navigate(`/dashboard/products/${originalProduct.product_id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/dashboard/products/${id}`)} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  step="1"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/dashboard/products/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProductEdit;
