
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

// Types for categories
type Category = {
  Category_id: string;
  name: string;
};

type SubCategory = {
  SubCategory_id: string;
  name: string;
};

// Fixed type definition to match database column names exactly
type SubSubCategory = {
  "Sub-SubCategory_id": string;
  name: string;
};

// Type for image URL
type ImageType = {
  url: string;
  color: string;
};

// Type for product details
type ProductDetails = {
  name: string;
  price: number;
  discount: string;
  Disclaimer: string;
  description: string;
  stock_quantity: number;
  image_url: string[] | ImageType[];
};

// Type for discount item
type DiscountItem = {
  price: string;
  weight: string;
  discount_percentage: string;
};

// Type for Clothing Type enum
type ClothingType = "Men" | "Women" | "Kids" | "Accessories" | null;

const ProductUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);

  // Selected category IDs
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string>("");
  const [isClothingCategory, setIsClothingCategory] = useState<boolean>(false);

  // Product details
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productDisclaimer, setProductDisclaimer] = useState("");
  const [productStock, setProductStock] = useState("");
  
  // Clothing specific fields
  const [clothingType, setClothingType] = useState<ClothingType>(null);
  
  // Images
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imageColors, setImageColors] = useState<string[]>([]);
  
  // Discounts
  const [discounts, setDiscounts] = useState<DiscountItem[]>([
    { price: "", weight: "", discount_percentage: "" }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser(data.session.user);
      } else {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch sub-categories when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
      
      // Check if selected category is clothing
      checkIfClothingCategory(selectedCategoryId);
    } else {
      setSubCategories([]);
      setSelectedSubCategoryId("");
      setIsClothingCategory(false);
      setClothingType(null);
    }
  }, [selectedCategoryId]);

  // Fetch sub-sub-categories when a sub-category is selected
  useEffect(() => {
    if (selectedSubCategoryId) {
      fetchSubSubCategories(selectedSubCategoryId);
    } else {
      setSubSubCategories([]);
      setSelectedSubSubCategoryId("");
    }
  }, [selectedSubCategoryId]);

  // Check if the selected category is clothing
  const checkIfClothingCategory = async (categoryId: string) => {
    try {
      const { data } = await supabase
        .from('Category')
        .select('name')
        .eq('Category_id', categoryId)
        .single();
      
      if (data) {
        // Check if name contains clothing or similar terms
        const name = data.name.toLowerCase();
        const isClothing = name.includes('cloth') || 
          name.includes('apparel') || 
          name.includes('wear') || 
          name.includes('fashion');
        
        setIsClothingCategory(isClothing);
        
        // Reset clothing type if not clothing category
        if (!isClothing) {
          setClothingType(null);
        }
      }
    } catch (error) {
      console.error('Error checking category type:', error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('Category_id, name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch sub-categories based on selected category
  const fetchSubCategories = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('SubCategory')
        .select('SubCategory_id, name')
        .eq('Category_id', categoryId);
      
      if (error) throw error;
      setSubCategories(data || []);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sub-categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch sub-sub-categories based on selected sub-category
  const fetchSubSubCategories = async (subCategoryId: string) => {
    try {
      // Use the correct column name in the select
      const { data, error } = await supabase
        .from('Sub-SubCategory')
        .select('"Sub-SubCategory_id", name')
        .eq('SubCategory_id', subCategoryId);
      
      if (error) throw error;
      setSubSubCategories(data || []);
    } catch (error) {
      console.error('Error fetching sub-sub-categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sub-sub-categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setProductImages(prev => [...prev, ...newFiles]);
      
      // Add default empty colors for each new image
      setImageColors(prev => [...prev, ...newFiles.map(() => "#FFFFFF")]);
    }
  };

  // Handle image color change
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...imageColors];
    newColors[index] = color;
    setImageColors(newColors);
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
    
    const newColors = [...imageColors];
    newColors.splice(index, 1);
    setImageColors(newColors);
  };

  // Add a new discount entry
  const addDiscount = () => {
    setDiscounts([...discounts, { price: "", weight: "", discount_percentage: "" }]);
  };

  // Remove a discount entry
  const removeDiscount = (index: number) => {
    const newDiscounts = [...discounts];
    newDiscounts.splice(index, 1);
    setDiscounts(newDiscounts);
  };

  // Update discount values
  const updateDiscount = (index: number, field: keyof DiscountItem, value: string) => {
    const newDiscounts = [...discounts];
    newDiscounts[index][field] = value;
    setDiscounts(newDiscounts);
  };

  // Upload images to Supabase Storage
  const uploadImages = async () => {
    if (!currentUser) return [];
    
    const uploadPromises = productImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${index}.${fileExt}`;
      const filePath = `product_images/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicURLData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      // Return appropriate structure based on category type
      if (isClothingCategory) {
        // For clothing category, return ImageType objects
        return {
          color: imageColors[index],
          url: publicURLData.publicUrl
        } as ImageType;
      } else {
        // For non-clothing category, return strings
        return publicURLData.publicUrl;
      }
    });
    
    // Handle the resulting promise
    const results = await Promise.all(uploadPromises);
    
    // Type guard to ensure we're returning the correct type
    if (isClothingCategory) {
      return results as ImageType[]; // Cast to ImageType[] when it's a clothing category
    } else {
      return results as string[]; // Cast to string[] when it's not a clothing category
    }
  };

  // Submit the product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "Please log in to upload products.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedCategoryId || !selectedSubCategoryId || !selectedSubSubCategoryId) {
      toast({
        title: "Missing Information",
        description: "Please select all category levels.",
        variant: "destructive",
      });
      return;
    }
    
    if (productImages.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }
    
    if (isClothingCategory && !clothingType) {
      toast({
        title: "Missing Information",
        description: "Please select clothing type.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Upload images and get URLs
      const imageUrls = await uploadImages();
      setUploadProgress(50);
      
      // 2. Prepare product details
      const productDetails: ProductDetails = {
        name: productName,
        price: parseFloat(productPrice),
        discount: "no", // Default value
        Disclaimer: productDisclaimer,
        description: productDescription,
        stock_quantity: parseInt(productStock),
        image_url: imageUrls
      };
      
      // 3. Filter out any incomplete discounts
      const validDiscounts = discounts.filter(
        (d) => d.price && d.weight && d.discount_percentage
      );

      // 4. Determine structure based on category type
      const structure = isClothingCategory ? "structure_2" : "structure_1";
      
      // 5. Insert product into database
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            details: productDetails,
            "Category_id": selectedCategoryId,
            "subCategory_id": selectedSubCategoryId,
            "sub-subCategory_id": selectedSubSubCategoryId,
            structure: structure,
            discount: validDiscounts.length > 0 ? validDiscounts : null,
            approved: false, // Default value
            uploaded_by: currentUser.id,
            type: isClothingCategory ? clothingType : null,
            image: imageUrls // Store image URLs in the image column as well
          }
        ]);
      
      setUploadProgress(100);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product uploaded successfully and pending approval.",
      });
      
      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductDisclaimer("");
      setProductStock("");
      setProductImages([]);
      setImageColors([]);
      setDiscounts([{ price: "", weight: "", discount_percentage: "" }]);
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
      setSelectedSubSubCategoryId("");
      setClothingType(null);
      
    } catch (error) {
      console.error('Error uploading product:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload New Product</CardTitle>
          <CardDescription>
            Fill out the details below to add a new product to the marketplace
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Categories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Main Category</Label>
                  <Select 
                    value={selectedCategoryId} 
                    onValueChange={setSelectedCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.Category_id} 
                          value={category.Category_id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Sub Category</Label>
                  <Select 
                    value={selectedSubCategoryId} 
                    onValueChange={setSelectedSubCategoryId}
                    disabled={!selectedCategoryId || subCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCategory) => (
                        <SelectItem 
                          key={subCategory.SubCategory_id} 
                          value={subCategory.SubCategory_id}
                        >
                          {subCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subsubcategory">Sub-Sub Category</Label>
                  <Select 
                    value={selectedSubSubCategoryId} 
                    onValueChange={setSelectedSubSubCategoryId}
                    disabled={!selectedSubCategoryId || subSubCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub-sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subSubCategories.map((subSubCategory) => (
                        <SelectItem 
                          key={subSubCategory["Sub-SubCategory_id"]} 
                          value={subSubCategory["Sub-SubCategory_id"]}
                        >
                          {subSubCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Clothing Type Selection (Only shown for clothing categories) */}
            {isClothingCategory && (
              <div className="space-y-2">
                <Label htmlFor="clothingType">Clothing Type</Label>
                <Select 
                  value={clothingType || ""} 
                  onValueChange={(value) => setClothingType(value as ClothingType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clothing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input 
                    id="productName" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Base Price</Label>
                  <Input 
                    id="productPrice" 
                    type="number" 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                    min="0" 
                    step="0.01" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea 
                  id="productDescription" 
                  value={productDescription} 
                  onChange={(e) => setProductDescription(e.target.value)} 
                  rows={3} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productDisclaimer">Disclaimer (Optional)</Label>
                <Textarea 
                  id="productDisclaimer" 
                  value={productDisclaimer} 
                  onChange={(e) => setProductDisclaimer(e.target.value)} 
                  rows={2} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productStock">Stock Quantity</Label>
                <Input 
                  id="productStock" 
                  type="number" 
                  value={productStock} 
                  onChange={(e) => setProductStock(e.target.value)} 
                  min="0" 
                  required 
                />
              </div>
            </div>
            
            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Images</h3>
              
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('imageInput')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
                <Input 
                  id="imageInput" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                <p className="text-sm text-muted-foreground">
                  {isClothingCategory 
                    ? "Upload images for different colors of your clothing product"
                    : "Upload clear images of your product"}
                </p>
              </div>
              
              {/* Image Preview */}
              {productImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {productImages.map((image, index) => (
                    <div key={index} className="relative border rounded-md p-2 space-y-3">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Product preview ${index + 1}`} 
                        className="w-full aspect-square object-cover rounded-md mb-2" 
                      />
                      
                      <div className="space-y-2">
                        <Label className="text-sm">
                          {isClothingCategory ? "Select color" : "Image color"}
                        </Label>
                        <ColorPicker
                          selectedColor={imageColors[index]}
                          onChange={(color) => handleColorChange(index, color)}
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="w-full mt-2" 
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Discount Options */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Discount Options</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addDiscount}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
              
              {discounts.map((discount, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor={`discount-price-${index}`}>Price</Label>
                    <Input 
                      id={`discount-price-${index}`} 
                      value={discount.price} 
                      onChange={(e) => updateDiscount(index, 'price', e.target.value)} 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="e.g., 37" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`discount-weight-${index}`}>{isClothingCategory ? "Size" : "Weight"}</Label>
                    <Input 
                      id={`discount-weight-${index}`} 
                      value={discount.weight} 
                      onChange={(e) => updateDiscount(index, 'weight', e.target.value)} 
                      placeholder={isClothingCategory ? "e.g., XL" : "e.g., 100 grams"} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`discount-percentage-${index}`}>Discount %</Label>
                    <Input 
                      id={`discount-percentage-${index}`} 
                      value={discount.discount_percentage} 
                      onChange={(e) => updateDiscount(index, 'discount_percentage', e.target.value)} 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="e.g., 21" 
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive" 
                      onClick={() => removeDiscount(index)}
                      disabled={discounts.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full hero-gradient" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading Product...
                </>
              ) : "Submit Product for Approval"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProductUpload;
