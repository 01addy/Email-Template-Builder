const Template = require('../models/templateModel');
const { supabase } = require('../server'); // Import Supabase client
const uploadToSupabase = require('../utils/uploadToSupabase');

// Get all templates (admin + user-specific)
const getTemplates = async (req, res) => {
  try {
    const { user } = req;

    // Fetch admin templates (where user_id is null)
    const { data: adminTemplates, error: adminError } = await supabase
      .from('templates')
      .select('*')
      .is('user_id', null);

    if (adminError) {
      console.error('Error fetching admin templates:', adminError.message);
      return res.status(500).json({ message: 'Error fetching templates' });
    }

    // Fetch user-specific templates
    const { data: userTemplates, error: userError } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', user);

    if (userError) {
      console.error('Error fetching user templates:', userError.message);
      return res.status(500).json({ message: 'Error fetching templates' });
    }

    // Combine and return both sets of templates
    const allTemplates = [...adminTemplates, ...userTemplates];
    res.status(200).json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new template
const createTemplate = async (req, res) => {
  const { title, subject, content } = req.body;
  const file = req.file; // Image file from Multer

  // Validate input fields
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    // Upload the image to Supabase if a file is provided
    let imageUrl = null;
    if (file) {
      imageUrl = await uploadToSupabase(file, 'images');
    }

    // Insert template into Supabase
    const { data, error } = await supabase
      .from('templates')
      .insert([
        {
          user_id: req.user, // User ID from authMiddleware
          title: title || null,
          subject: subject || null,
          content,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting template:', error.message);
      return res.status(500).json({ message: 'Error saving template' });
    }

    res.status(201).json({
      message: 'Template created successfully',
      template: data[0],
    });
  } catch (error) {
    console.error('Error creating template:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTemplates, createTemplate };
