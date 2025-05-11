/**
 * Utility for seeding test data into Supabase
 * This would be used during development to populate the database
 */
import { getServiceSupabase } from './supabase-client';
import { testUsers, products } from './test-data';

/**
 * Seeds users from test data into Supabase
 * This would be run as a one-time setup for development
 */
export const seedUsers = async () => {
  const supabase = getServiceSupabase();
  
  // Track created users
  const createdUsers = [];
  
  try {
    console.log('Seeding users...');
    
    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .limit(1);
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`);
        createdUsers.push(existingUsers[0]);
        continue;
      }
      
      // Split name into first_name and last_name
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Insert user
      const { data: createdUser, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          phone: user.mobile,
          first_name: firstName,
          last_name: lastName,
          address_line1: user.address.street,
          city: user.address.city,
          postal_code: user.address.postalCode,
          country: user.address.country
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
        continue;
      }
      
      console.log(`Created user: ${createdUser.email}`);
      createdUsers.push(createdUser);
      
      // Create payment methods for this user
      if (user.paymentMethods && user.paymentMethods.length > 0) {
        for (const pm of user.paymentMethods) {
          await seedPaymentMethod(createdUser.id, pm);
        }
      }
    }
    
    console.log(`Seeded ${createdUsers.length} users successfully`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

/**
 * Seeds payment methods for a user
 */
export const seedPaymentMethod = async (userId, paymentMethod) => {
  const supabase = getServiceSupabase();
  
  try {
    // Extract last four if available in the label
    let lastFour = null;
    const match = paymentMethod.label.match(/•{4}\s*(\d{4})/);
    if (match && match[1]) {
      lastFour = match[1];
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method_type: paymentMethod.type,
        label: paymentMethod.label,
        last_four: lastFour,
        expiry_date: paymentMethod.expiryDate,
        is_default: paymentMethod.isDefault
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating payment method for user ${userId}:`, error);
      return null;
    }
    
    console.log(`Created payment method: ${data.label} for user ${userId}`);
    return data;
  } catch (error) {
    console.error(`Error seeding payment method for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Seeds products from test data into Supabase
 */
export const seedProducts = async () => {
  const supabase = getServiceSupabase();
  
  try {
    console.log('Seeding products...');
    
    for (const product of products) {
      // Check if product already exists
      const { data: existingProducts } = await supabase
        .from('products')
        .select('*')
        .eq('name', product.name)
        .limit(1);
      
      if (existingProducts && existingProducts.length > 0) {
        console.log(`Product ${product.name} already exists, skipping...`);
        continue;
      }
      
      // Insert product
      const { data: createdProduct, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          image_emoji: product.image,
          stock_quantity: 100 // Default value
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating product ${product.name}:`, error);
        continue;
      }
      
      console.log(`Created product: ${createdProduct.name}`);
      
      // Create product variants if available
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert({
              product_id: createdProduct.id,
              color: variant.color,
              size: variant.size,
              sku: `${product.name.substring(0, 3).toUpperCase()}-${variant.color.substring(0, 3).toUpperCase()}-${variant.size}`,
              stock_quantity: 30 // Default value
            });
          
          if (variantError) {
            console.error(`Error creating variant for product ${createdProduct.name}:`, variantError);
          }
        }
      }
    }
    
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

/**
 * Seeds all data into Supabase
 */
export const seedAllData = async () => {
  try {
    await seedProducts();
    await seedUsers();
    console.log('All data seeded successfully');
  } catch (error) {
    console.error('Error seeding all data:', error);
    throw error;
  }
};