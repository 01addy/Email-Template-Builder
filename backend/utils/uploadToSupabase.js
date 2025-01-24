const { supabase } = require('../server');

const uploadToSupabase = async (file, bucketName) => {
  try {
    const filePath = `public/${Date.now()}_${file.originalname}`; // Unique file path
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Overwrite files with the same name
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      throw error;
    }

    // Get the public URL of the uploaded file
    const { publicUrl, error: urlError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error generating public URL:', urlError);
      throw urlError;
    }

    console.log('File uploaded successfully with public URL:', publicUrl);
    return publicUrl; // Return the public URL
  } catch (err) {
    console.error('Error in uploadToSupabase function:', err);
    throw err;
  }
};

module.exports = uploadToSupabase;
