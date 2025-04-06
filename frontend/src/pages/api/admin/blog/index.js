import db from '../../../../utils/dbService';
import axios from 'axios';

export default async function handler(req, res) {
  // Check authentication (same as in admin/index.js)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const posts = await getBlogPosts();
        return res.status(200).json({ 
          success: true, 
          data: posts 
        });
        
      case 'POST':
        const newPost = await createBlogPost(req.body);
        return res.status(201).json({ 
          success: true, 
          data: newPost 
        });
        
      default:
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

/**
 * Get blog posts from database
 */
async function getBlogPosts() {
  try {
    // First try to get posts from the database
    const dbResult = await db.query(`
      SELECT 
        id, title, content, excerpt, author, image_url, 
        published_date, category, source_url, is_external
      FROM blog_posts
      ORDER BY published_date DESC
      LIMIT 50
    `);

    // Format database posts
    const dbPosts = dbResult.rows.map(formatBlogPost);
    
    // If we have enough posts, just return them
    if (dbPosts.length >= 10) {
      return dbPosts;
    }
    
    // Otherwise, fetch external posts to supplement
    const externalPosts = await fetchExternalBlogPosts();
    
    // Save external posts to database for future use
    await saveExternalPosts(externalPosts);
    
    // Return combined list
    return [...dbPosts, ...externalPosts].slice(0, 50);
  } catch (error) {
    console.error('Error getting blog posts:', error);
    
    // If database query fails, fall back to external posts
    try {
      return await fetchExternalBlogPosts();
    } catch (fallbackError) {
      console.error('Fallback error fetching external posts:', fallbackError);
      throw error; // Throw original error if fallback also fails
    }
  }
}

/**
 * Create a new blog post
 */
async function createBlogPost(postData) {
  try {
    const { title, content, excerpt, author, imageUrl, category } = postData;
    
    const result = await db.query(`
      INSERT INTO blog_posts (
        title, content, excerpt, author, image_url, 
        published_date, category, is_external
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title,
      content,
      excerpt || content.substring(0, 150) + '...',
      author || 'StuHouses Team',
      imageUrl,
      new Date(),
      category || 'General',
      false
    ]);
    
    return formatBlogPost(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Format a blog post from database
 */
function formatBlogPost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    author: post.author,
    imageUrl: post.image_url,
    publishedDate: post.published_date,
    category: post.category,
    sourceUrl: post.source_url,
    isExternal: post.is_external
  };
}

/**
 * Fetch blog posts from external sources
 */
async function fetchExternalBlogPosts() {
  try {
    // For demonstration, we'll parse a sample from accommodationforstudents.com
    const posts = [
      {
        title: "Understanding the National University Cuts",
        excerpt: "What do the national education cuts mean for students and higher education in the future?",
        content: "As a student, there is no way to avoid the news of upcoming university cuts and what this might mean for education. This comprehensive guide helps you understand what's happening and how it might affect your studies.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/university-cuts.jpg",
        publishedDate: new Date("2025-03-20"),
        category: "Education",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/understanding-the-national-university-cuts",
        isExternal: true
      },
      {
        title: "The Spring-Summer Semester at University",
        excerpt: "Congratulations you've done it! You have completed your first semester and navigated new environments, people, and routines.",
        content: "Spring-Summer Semester: Congratulations you've done it! You have completed your first semester and navigated new environments, people, and routines. But the journey continues with the spring-summer semester bringing new opportunities and challenges.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/spring-summer.jpg",
        publishedDate: new Date("2025-03-12"),
        category: "University Life",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/the-spring-summer-semester-at-university",
        isExternal: true
      },
      {
        title: "How to engage with landlords",
        excerpt: "You've done all your research and found a great student property! But knowing what to do next can be stressful.",
        content: "You've done all your research and found a great student property! But knowing what to do next can be stressful, and figuring out the right questions to ask can be challenging. This guide helps you navigate landlord communications effectively.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/landlords.jpg",
        publishedDate: new Date("2025-02-24"),
        category: "Housing",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/how-to-engage-with-landlords",
        isExternal: true
      },
      {
        title: "What is a group tenancy?",
        excerpt: "If you're renting private student housing, you will likely be doing so under a group tenancy.",
        content: "If you're renting private student housing, you will likely be doing so under a group tenancy. As group tenancies are one of the most popular tenancies students use, it's important to understand how they work and what your responsibilities are.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/group-tenancy.jpg",
        publishedDate: new Date("2025-01-10"),
        category: "Housing",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/what-is-a-group-tenancy",
        isExternal: true
      },
      {
        title: "How to shake off the January blues",
        excerpt: "So, Christmas is well and truly over and January is now upon us. Are you feeling blue yet?",
        content: "So, Christmas is well and truly over and January is now upon us. Are you feeling blue yet? If you are, then try not to worry! January is of course a strange time for many people. Here are some practical tips to help you overcome those January blues.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/january-blues.jpg",
        publishedDate: new Date("2025-01-08"),
        category: "Wellbeing",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/how-to-shake-off-the-january-blues",
        isExternal: true
      },
      {
        title: "Can I Bring my Car to University?",
        excerpt: "The idea of driving your car while at university is appealing. You won't be restricted to bus or train schedules.",
        content: "The idea of driving your car while at university is appealing. You won't be restricted to bus or train schedules and have an additional layer of freedom. While it sounds great, there are many factors to consider before bringing your car to campus.",
        author: "AFS Team",
        imageUrl: "https://example.com/images/car-university.jpg",
        publishedDate: new Date("2025-01-07"),
        category: "University Life",
        sourceUrl: "https://www.accommodationforstudents.com/student-blog/can-i-bring-my-car-to-university",
        isExternal: true
      }
    ];
    
    return posts;
  } catch (error) {
    console.error('Error fetching external blog posts:', error);
    return [];
  }
}

/**
 * Save external posts to database
 */
async function saveExternalPosts(posts) {
  try {
    // Begin transaction
    const client = await db.getClient();
    await client.query('BEGIN');
    
    for (const post of posts) {
      // Check if post already exists by title and source
      const existingResult = await client.query(
        'SELECT id FROM blog_posts WHERE title = $1 AND source_url = $2',
        [post.title, post.sourceUrl]
      );
      
      if (existingResult.rows.length === 0) {
        // Post doesn't exist, save it
        await client.query(`
          INSERT INTO blog_posts (
            title, content, excerpt, author, image_url, 
            published_date, category, source_url, is_external
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          post.title,
          post.content,
          post.excerpt,
          post.author,
          post.imageUrl,
          post.publishedDate,
          post.category,
          post.sourceUrl,
          true
        ]);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    client.release();
  } catch (error) {
    console.error('Error saving external posts:', error);
    // If client exists, rollback transaction
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
  }
} 