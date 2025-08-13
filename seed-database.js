const { sequelize } = require("./src/config/database");
const {
  User,
  UserDetails,
  Gallery,
  Consultation,
  Project,
  Review,
  Notification,
} = require("./src/models/associations");

// Sample data arrays
const designerProfiles = [
  {
    username: "sarahmodern",
    email: "sarah.johnson@decorvista.com",
    firstname: "Sarah",
    lastname: "Johnson",
    contact_number: "+1234567890",
    address: "123 Design Street, New York, NY 10001",
    gender: "female",
    date_of_birth: "1985-03-15",
  },
  {
    username: "mikeindustrial",
    email: "mike.chen@decorvista.com",
    firstname: "Mike",
    lastname: "Chen",
    contact_number: "+1234567891",
    address: "456 Creative Ave, Los Angeles, CA 90210",
    gender: "male",
    date_of_birth: "1982-07-22",
  },
  {
    username: "emmascandinavian",
    email: "emma.nordic@decorvista.com",
    firstname: "Emma",
    lastname: "Nordström",
    contact_number: "+1234567892",
    address: "789 Minimalist Blvd, Seattle, WA 98101",
    gender: "female",
    date_of_birth: "1988-11-08",
  },
  {
    username: "alexcontemporary",
    email: "alex.rivera@decorvista.com",
    firstname: "Alex",
    lastname: "Rivera",
    contact_number: "+1234567893",
    address: "321 Style Lane, Miami, FL 33101",
    gender: "other",
    date_of_birth: "1990-05-12",
  },
  {
    username: "lisatraditional",
    email: "lisa.williams@decorvista.com",
    firstname: "Lisa",
    lastname: "Williams",
    contact_number: "+1234567894",
    address: "654 Classic Court, Boston, MA 02101",
    gender: "female",
    date_of_birth: "1983-09-30",
  },
  {
    username: "davidminimalist",
    email: "david.kim@decorvista.com",
    firstname: "David",
    lastname: "Kim",
    contact_number: "+1234567895",
    address: "987 Clean Line Dr, San Francisco, CA 94101",
    gender: "male",
    date_of_birth: "1987-01-18",
  },
  {
    username: "mariabohemian",
    email: "maria.santos@decorvista.com",
    firstname: "Maria",
    lastname: "Santos",
    contact_number: "+1234567896",
    address: "147 Artistic Way, Austin, TX 78701",
    gender: "female",
    date_of_birth: "1986-12-03",
  },
  {
    username: "jamesrustic",
    email: "james.brown@decorvista.com",
    firstname: "James",
    lastname: "Brown",
    contact_number: "+1234567897",
    address: "258 Country Road, Nashville, TN 37201",
    gender: "male",
    date_of_birth: "1984-04-25",
  },
  {
    username: "sophiaartdeco",
    email: "sophia.martinez@decorvista.com",
    firstname: "Sophia",
    lastname: "Martinez",
    contact_number: "+1234567898",
    address: "369 Glamour St, Las Vegas, NV 89101",
    gender: "female",
    date_of_birth: "1989-08-14",
  },
  {
    username: "ryanmidcentury",
    email: "ryan.davis@decorvista.com",
    firstname: "Ryan",
    lastname: "Davis",
    contact_number: "+1234567899",
    address: "741 Retro Ave, Portland, OR 97201",
    gender: "male",
    date_of_birth: "1985-06-07",
  },
];

const clientProfiles = [
  {
    username: "johnclient",
    email: "john.doe@email.com",
    firstname: "John",
    lastname: "Doe",
    contact_number: "+1555000001",
    address: "100 Client Street, Chicago, IL 60601",
    gender: "male",
    date_of_birth: "1992-03-10",
  },
  {
    username: "janehomeowner",
    email: "jane.smith@email.com",
    firstname: "Jane",
    lastname: "Smith",
    contact_number: "+1555000002",
    address: "200 Home Ave, Denver, CO 80201",
    gender: "female",
    date_of_birth: "1988-07-15",
  },
  {
    username: "robertrenovator",
    email: "robert.wilson@email.com",
    firstname: "Robert",
    lastname: "Wilson",
    contact_number: "+1555000003",
    address: "300 Renovation Rd, Phoenix, AZ 85001",
    gender: "male",
    date_of_birth: "1985-11-22",
  },
  {
    username: "emilydecorator",
    email: "emily.jones@email.com",
    firstname: "Emily",
    lastname: "Jones",
    contact_number: "+1555000004",
    address: "400 Decor Lane, Atlanta, GA 30301",
    gender: "female",
    date_of_birth: "1990-05-08",
  },
  {
    username: "michaelbuilder",
    email: "michael.taylor@email.com",
    firstname: "Michael",
    lastname: "Taylor",
    contact_number: "+1555000005",
    address: "500 Builder Blvd, Houston, TX 77001",
    gender: "male",
    date_of_birth: "1987-09-12",
  },
];

const galleryData = [
  // Living Room designs
  {
    title: "Modern Living Room with Floor-to-Ceiling Windows",
    description:
      "A stunning modern living room featuring clean lines, neutral colors, and abundant natural light.",
    category: "living_room",
    style: "modern",
    color_palette: ["#FFFFFF", "#F5F5F5", "#333333", "#8B4513"],
    tags: ["modern", "minimalist", "natural light", "neutral colors"],
  },
  {
    title: "Cozy Scandinavian Living Space",
    description:
      "Warm and inviting living room with Scandinavian design principles and hygge elements.",
    category: "living_room",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F0F0F0", "#D2B48C", "#228B22"],
    tags: ["scandinavian", "cozy", "hygge", "wood accents"],
  },
  {
    title: "Industrial Loft Living Room",
    description:
      "Raw industrial elements combined with modern comfort in an urban loft setting.",
    category: "living_room",
    style: "industrial",
    color_palette: ["#2F2F2F", "#8B4513", "#CD853F", "#FF6347"],
    tags: ["industrial", "loft", "exposed brick", "metal accents"],
  },
  {
    title: "Traditional Family Living Room",
    description:
      "Classic traditional design with rich fabrics, warm colors, and timeless furniture.",
    category: "living_room",
    style: "traditional",
    color_palette: ["#8B0000", "#DAA520", "#F5DEB3", "#2F4F4F"],
    tags: ["traditional", "family friendly", "warm colors", "classic"],
  },
  {
    title: "Contemporary Open Concept Living",
    description:
      "Sleek contemporary design with open floor plan and statement lighting.",
    category: "living_room",
    style: "contemporary",
    color_palette: ["#FFFFFF", "#C0C0C0", "#000000", "#4169E1"],
    tags: ["contemporary", "open concept", "statement lighting"],
  },
  {
    title: "Bohemian Eclectic Living Room",
    description:
      "Vibrant bohemian style with mixed patterns, textures, and global influences.",
    category: "living_room",
    style: "bohemian",
    color_palette: ["#FF69B4", "#FFD700", "#32CD32", "#8A2BE2"],
    tags: ["bohemian", "eclectic", "colorful", "global style"],
  },
  {
    title: "Minimalist Zen Living Space",
    description:
      "Serene minimalist design focused on simplicity and tranquility.",
    category: "living_room",
    style: "minimalist",
    color_palette: ["#FFFFFF", "#F8F8FF", "#E6E6FA", "#D3D3D3"],
    tags: ["minimalist", "zen", "serene", "simple"],
  },
  {
    title: "Art Deco Glamour Living Room",
    description:
      "Luxurious Art Deco inspired living room with metallic accents and geometric patterns.",
    category: "living_room",
    style: "art_deco",
    color_palette: ["#FFD700", "#000000", "#FFFFFF", "#C0C0C0"],
    tags: ["art deco", "glamorous", "metallic", "geometric"],
  },

  // Bedroom designs
  {
    title: "Serene Master Bedroom Retreat",
    description:
      "Peaceful master bedroom with soft textures and calming color palette.",
    category: "bedroom",
    style: "contemporary",
    color_palette: ["#F5F5DC", "#E6E6FA", "#D8BFD8", "#B0C4DE"],
    tags: ["master bedroom", "serene", "calming", "retreat"],
  },
  {
    title: "Modern Minimalist Bedroom",
    description:
      "Clean and uncluttered bedroom design with focus on quality over quantity.",
    category: "bedroom",
    style: "minimalist",
    color_palette: ["#FFFFFF", "#F0F0F0", "#D3D3D3", "#696969"],
    tags: ["minimalist", "clean", "uncluttered", "modern"],
  },
  {
    title: "Rustic Farmhouse Bedroom",
    description:
      "Cozy farmhouse bedroom with reclaimed wood and vintage accessories.",
    category: "bedroom",
    style: "rustic",
    color_palette: ["#F5DEB3", "#DEB887", "#8B4513", "#228B22"],
    tags: ["rustic", "farmhouse", "reclaimed wood", "vintage"],
  },
  {
    title: "Scandinavian Bedroom Sanctuary",
    description:
      "Light and airy Scandinavian bedroom with natural materials and soft lighting.",
    category: "bedroom",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#8FBC8F"],
    tags: ["scandinavian", "natural materials", "soft lighting", "airy"],
  },
  {
    title: "Industrial Chic Bedroom",
    description:
      "Urban industrial bedroom with exposed elements and modern comfort.",
    category: "bedroom",
    style: "industrial",
    color_palette: ["#2F2F2F", "#696969", "#A0522D", "#FF4500"],
    tags: ["industrial", "urban", "exposed elements", "chic"],
  },
  {
    title: "Traditional Elegant Bedroom",
    description:
      "Sophisticated traditional bedroom with rich fabrics and classic furniture.",
    category: "bedroom",
    style: "traditional",
    color_palette: ["#8B0000", "#DAA520", "#F5DEB3", "#2F4F4F"],
    tags: ["traditional", "elegant", "sophisticated", "rich fabrics"],
  },
  {
    title: "Bohemian Dream Bedroom",
    description:
      "Whimsical bohemian bedroom with layered textiles and artistic elements.",
    category: "bedroom",
    style: "bohemian",
    color_palette: ["#FF1493", "#FFD700", "#32CD32", "#9370DB"],
    tags: ["bohemian", "whimsical", "layered textiles", "artistic"],
  },
  {
    title: "Mid-Century Modern Bedroom",
    description:
      "Retro-inspired bedroom with mid-century furniture and bold accents.",
    category: "bedroom",
    style: "mid_century",
    color_palette: ["#F0E68C", "#FF6347", "#4682B4", "#2F4F4F"],
    tags: ["mid-century", "retro", "bold accents", "vintage modern"],
  },

  // Kitchen designs
  {
    title: "Modern Chef's Kitchen",
    description:
      "Professional-grade modern kitchen with high-end appliances and sleek design.",
    category: "kitchen",
    style: "modern",
    color_palette: ["#FFFFFF", "#2F2F2F", "#C0C0C0", "#4169E1"],
    tags: ["modern", "chef kitchen", "high-end appliances", "sleek"],
  },
  {
    title: "Farmhouse Country Kitchen",
    description:
      "Warm and welcoming farmhouse kitchen with shaker cabinets and butcher block.",
    category: "kitchen",
    style: "rustic",
    color_palette: ["#F5DEB3", "#8B4513", "#FFFFFF", "#228B22"],
    tags: ["farmhouse", "country", "shaker cabinets", "butcher block"],
  },
  {
    title: "Scandinavian Kitchen Design",
    description:
      "Light and functional Scandinavian kitchen with natural wood and white finishes.",
    category: "kitchen",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F5F5F5", "#D2B48C", "#8FBC8F"],
    tags: ["scandinavian", "functional", "natural wood", "light"],
  },
  {
    title: "Industrial Kitchen Loft",
    description:
      "Urban industrial kitchen with exposed brick, steel, and concrete elements.",
    category: "kitchen",
    style: "industrial",
    color_palette: ["#2F2F2F", "#8B4513", "#C0C0C0", "#FF6347"],
    tags: ["industrial", "urban", "exposed brick", "steel"],
  },
  {
    title: "Traditional Gourmet Kitchen",
    description:
      "Classic traditional kitchen with rich wood cabinets and marble countertops.",
    category: "kitchen",
    style: "traditional",
    color_palette: ["#8B4513", "#F5DEB3", "#FFFFFF", "#2F4F4F"],
    tags: ["traditional", "gourmet", "wood cabinets", "marble"],
  },
  {
    title: "Contemporary Open Kitchen",
    description:
      "Sleek contemporary kitchen with island and open concept design.",
    category: "kitchen",
    style: "contemporary",
    color_palette: ["#FFFFFF", "#696969", "#000000", "#4169E1"],
    tags: ["contemporary", "open concept", "island", "sleek"],
  },
  {
    title: "Minimalist Kitchen Design",
    description:
      "Clean minimalist kitchen with hidden storage and seamless surfaces.",
    category: "kitchen",
    style: "minimalist",
    color_palette: ["#FFFFFF", "#F8F8FF", "#E6E6FA", "#D3D3D3"],
    tags: ["minimalist", "hidden storage", "seamless", "clean"],
  },
  {
    title: "Mid-Century Kitchen Revival",
    description:
      "Retro mid-century kitchen with colorful cabinets and vintage appliances.",
    category: "kitchen",
    style: "mid_century",
    color_palette: ["#F0E68C", "#FF6347", "#4682B4", "#32CD32"],
    tags: ["mid-century", "retro", "colorful", "vintage appliances"],
  },

  // Bathroom designs
  {
    title: "Spa-Like Master Bathroom",
    description:
      "Luxurious spa-inspired bathroom with natural materials and calming elements.",
    category: "bathroom",
    style: "contemporary",
    color_palette: ["#F5F5DC", "#E6E6FA", "#D8BFD8", "#8FBC8F"],
    tags: ["spa-like", "luxurious", "natural materials", "calming"],
  },
  {
    title: "Modern Minimalist Bathroom",
    description:
      "Clean and simple bathroom design with geometric lines and neutral colors.",
    category: "bathroom",
    style: "minimalist",
    color_palette: ["#FFFFFF", "#F0F0F0", "#D3D3D3", "#696969"],
    tags: ["minimalist", "geometric", "neutral", "simple"],
  },
  {
    title: "Industrial Bathroom Design",
    description:
      "Urban industrial bathroom with exposed pipes, concrete, and metal fixtures.",
    category: "bathroom",
    style: "industrial",
    color_palette: ["#2F2F2F", "#696969", "#C0C0C0", "#8B4513"],
    tags: ["industrial", "exposed pipes", "concrete", "metal fixtures"],
  },
  {
    title: "Traditional Elegant Bathroom",
    description:
      "Classic traditional bathroom with marble, brass fixtures, and rich details.",
    category: "bathroom",
    style: "traditional",
    color_palette: ["#FFFFFF", "#DAA520", "#8B0000", "#2F4F4F"],
    tags: ["traditional", "marble", "brass fixtures", "elegant"],
  },
  {
    title: "Scandinavian Bathroom Retreat",
    description:
      "Serene Scandinavian bathroom with natural wood and white ceramic.",
    category: "bathroom",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F5F5F5", "#D2B48C", "#E0E0E0"],
    tags: ["scandinavian", "natural wood", "ceramic", "serene"],
  },
  {
    title: "Art Deco Powder Room",
    description:
      "Glamorous Art Deco powder room with geometric patterns and metallic accents.",
    category: "bathroom",
    style: "art_deco",
    color_palette: ["#FFD700", "#000000", "#FFFFFF", "#C0C0C0"],
    tags: ["art deco", "powder room", "geometric", "metallic"],
  },
  {
    title: "Rustic Farmhouse Bathroom",
    description:
      "Cozy farmhouse bathroom with reclaimed wood and vintage fixtures.",
    category: "bathroom",
    style: "rustic",
    color_palette: ["#F5DEB3", "#8B4513", "#FFFFFF", "#228B22"],
    tags: ["rustic", "farmhouse", "reclaimed wood", "vintage fixtures"],
  },
  {
    title: "Contemporary Guest Bathroom",
    description:
      "Stylish contemporary guest bathroom with bold tiles and modern fixtures.",
    category: "bathroom",
    style: "contemporary",
    color_palette: ["#FFFFFF", "#4169E1", "#C0C0C0", "#000000"],
    tags: ["contemporary", "guest bathroom", "bold tiles", "modern fixtures"],
  },

  // Office designs
  {
    title: "Modern Home Office",
    description:
      "Productive modern home office with ergonomic furniture and tech integration.",
    category: "office",
    style: "modern",
    color_palette: ["#FFFFFF", "#2F2F2F", "#4169E1", "#C0C0C0"],
    tags: ["home office", "ergonomic", "tech integration", "productive"],
  },
  {
    title: "Industrial Co-Working Space",
    description:
      "Creative industrial office space with exposed elements and collaborative areas.",
    category: "office",
    style: "industrial",
    color_palette: ["#2F2F2F", "#8B4513", "#FF6347", "#C0C0C0"],
    tags: ["co-working", "industrial", "collaborative", "creative"],
  },
  {
    title: "Scandinavian Study Room",
    description:
      "Calm and focused Scandinavian study with natural light and minimal distractions.",
    category: "office",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F5F5F5", "#D2B48C", "#8FBC8F"],
    tags: ["study room", "scandinavian", "natural light", "minimal"],
  },
  {
    title: "Traditional Executive Office",
    description:
      "Sophisticated traditional executive office with rich wood and leather.",
    category: "office",
    style: "traditional",
    color_palette: ["#8B4513", "#8B0000", "#DAA520", "#2F4F4F"],
    tags: ["executive office", "traditional", "rich wood", "leather"],
  },
  {
    title: "Contemporary Creative Studio",
    description:
      "Inspiring contemporary creative studio with flexible workspace and art displays.",
    category: "office",
    style: "contemporary",
    color_palette: ["#FFFFFF", "#FF6347", "#4169E1", "#32CD32"],
    tags: ["creative studio", "contemporary", "flexible", "inspiring"],
  },
  {
    title: "Minimalist Workspace",
    description:
      "Clean minimalist workspace designed for focus and productivity.",
    category: "office",
    style: "minimalist",
    color_palette: ["#FFFFFF", "#F8F8FF", "#E6E6FA", "#D3D3D3"],
    tags: ["minimalist", "workspace", "focus", "productivity"],
  },
  {
    title: "Bohemian Artist Studio",
    description:
      "Eclectic bohemian artist studio with vibrant colors and creative chaos.",
    category: "office",
    style: "bohemian",
    color_palette: ["#FF69B4", "#FFD700", "#32CD32", "#8A2BE2"],
    tags: ["artist studio", "bohemian", "vibrant", "creative"],
  },
  {
    title: "Mid-Century Modern Office",
    description:
      "Retro mid-century office with vintage furniture and bold geometric patterns.",
    category: "office",
    style: "mid_century",
    color_palette: ["#F0E68C", "#FF6347", "#4682B4", "#2F4F4F"],
    tags: ["mid-century", "retro", "vintage furniture", "geometric"],
  },

  // Dining Room designs
  {
    title: "Elegant Formal Dining Room",
    description:
      "Sophisticated formal dining room perfect for entertaining guests.",
    category: "dining_room",
    style: "traditional",
    color_palette: ["#8B0000", "#DAA520", "#F5DEB3", "#2F4F4F"],
    tags: ["formal dining", "elegant", "entertaining", "sophisticated"],
  },
  {
    title: "Modern Open Dining Space",
    description:
      "Contemporary open dining area integrated with kitchen and living spaces.",
    category: "dining_room",
    style: "modern",
    color_palette: ["#FFFFFF", "#2F2F2F", "#C0C0C0", "#4169E1"],
    tags: ["open dining", "contemporary", "integrated", "modern"],
  },
  {
    title: "Scandinavian Family Dining",
    description:
      "Warm Scandinavian dining room designed for family gatherings.",
    category: "dining_room",
    style: "scandinavian",
    color_palette: ["#FFFFFF", "#F5F5F5", "#D2B48C", "#8FBC8F"],
    tags: ["family dining", "scandinavian", "warm", "gatherings"],
  },
  {
    title: "Industrial Dining Loft",
    description:
      "Urban industrial dining space with raw materials and modern lighting.",
    category: "dining_room",
    style: "industrial",
    color_palette: ["#2F2F2F", "#8B4513", "#C0C0C0", "#FF6347"],
    tags: ["industrial", "loft", "raw materials", "urban"],
  },
  {
    title: "Bohemian Eclectic Dining",
    description:
      "Colorful bohemian dining room with mixed furniture and global influences.",
    category: "dining_room",
    style: "bohemian",
    color_palette: ["#FF69B4", "#FFD700", "#32CD32", "#8A2BE2"],
    tags: ["bohemian", "eclectic", "colorful", "global"],
  },
  {
    title: "Mid-Century Dining Room",
    description:
      "Retro mid-century dining room with iconic furniture and bold colors.",
    category: "dining_room",
    style: "mid_century",
    color_palette: ["#F0E68C", "#FF6347", "#4682B4", "#32CD32"],
    tags: ["mid-century", "retro", "iconic furniture", "bold colors"],
  },

  // Outdoor designs
  {
    title: "Modern Outdoor Patio",
    description:
      "Sleek modern patio with weather-resistant furniture and outdoor kitchen.",
    category: "outdoor",
    style: "modern",
    color_palette: ["#FFFFFF", "#2F2F2F", "#8FBC8F", "#4169E1"],
    tags: ["patio", "modern", "weather-resistant", "outdoor kitchen"],
  },
  {
    title: "Rustic Garden Retreat",
    description:
      "Natural rustic outdoor space with wooden elements and native plants.",
    category: "outdoor",
    style: "rustic",
    color_palette: ["#8B4513", "#228B22", "#F5DEB3", "#654321"],
    tags: ["garden", "rustic", "wooden elements", "native plants"],
  },
  {
    title: "Contemporary Pool Area",
    description:
      "Stylish contemporary pool area with lounge seating and modern landscaping.",
    category: "outdoor",
    style: "contemporary",
    color_palette: ["#FFFFFF", "#4169E1", "#C0C0C0", "#00CED1"],
    tags: ["pool area", "contemporary", "lounge seating", "landscaping"],
  },
  {
    title: "Bohemian Outdoor Oasis",
    description:
      "Eclectic bohemian outdoor space with colorful textiles and hanging plants.",
    category: "outdoor",
    style: "bohemian",
    color_palette: ["#FF69B4", "#FFD700", "#32CD32", "#8A2BE2"],
    tags: ["outdoor oasis", "bohemian", "colorful textiles", "hanging plants"],
  },
];

const consultationTitles = [
  "Initial Design Consultation",
  "Kitchen Renovation Planning",
  "Living Room Makeover Discussion",
  "Bedroom Design Review",
  "Bathroom Remodel Consultation",
  "Home Office Setup Planning",
  "Dining Room Design Meeting",
  "Outdoor Space Planning",
  "Color Scheme Consultation",
  "Furniture Selection Meeting",
  "Lighting Design Discussion",
  "Space Planning Session",
  "Budget Planning Meeting",
  "Material Selection Consultation",
  "Final Design Review",
  "Project Progress Check",
  "Style Direction Meeting",
  "Room Layout Planning",
  "Decor Selection Session",
  "Design Implementation Review",
];

const consultationDescriptions = [
  "Discuss overall design vision and project scope",
  "Plan kitchen layout, appliances, and storage solutions",
  "Transform living space with new furniture and decor",
  "Create a peaceful and functional bedroom retreat",
  "Design a spa-like bathroom experience",
  "Optimize home office for productivity and comfort",
  "Plan elegant dining space for entertaining",
  "Design outdoor living and entertainment areas",
  "Select cohesive color palette for entire home",
  "Choose furniture pieces that fit style and budget",
  "Plan lighting scheme for ambiance and function",
  "Optimize room layouts for better flow and function",
  "Discuss project timeline and budget allocation",
  "Select materials, finishes, and fixtures",
  "Review final design plans before implementation",
  "Check progress and address any concerns",
  "Define design style and aesthetic direction",
  "Plan optimal furniture placement and flow",
  "Select decorative elements and accessories",
  "Review completed work and final touches",
];

const clientRequirements = [
  "Looking for modern and minimalist design approach",
  "Need family-friendly solutions with durable materials",
  "Want to incorporate existing furniture pieces",
  "Interested in sustainable and eco-friendly options",
  "Need storage solutions for small space",
  "Want to create a cozy and welcoming atmosphere",
  "Looking for luxury finishes within budget",
  "Need pet-friendly design considerations",
  "Want to maximize natural light in the space",
  "Interested in smart home technology integration",
  "Need wheelchair accessible design solutions",
  "Want to create separate work and relaxation zones",
  "Looking for low-maintenance design options",
  "Need soundproofing for home office",
  "Want to incorporate art collection into design",
  "Looking for energy-efficient lighting solutions",
  "Need child-safe design elements",
  "Want to create indoor-outdoor living connection",
  "Looking for vintage and antique incorporation",
  "Need flexible multi-purpose room design",
];

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random date within range
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper function to generate random image URL (placeholder)
function generateImageUrl(category, index) {
  return `https://images.unsplash.com/photo-${1500000000000 + index}?w=800&h=600&fit=crop&crop=center`;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...");
    await Notification.destroy({ where: {} });
    await Review.destroy({ where: {} });
    await Consultation.destroy({ where: {} });
    await Gallery.destroy({ where: {} });
    await Project.destroy({ where: {} });
    await UserDetails.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log("✅ Existing data cleared");

    // Create admin user
    console.log("👤 Creating admin user...");
    const adminUser = await User.create({
      username: "admin",
      email: "admin@decorvista.com",
      password_hash: "admin123", // Will be hashed by the model hook
      role: "admin",
      is_active: true,
      email_verified: true,
    });

    await UserDetails.create({
      user_id: adminUser.user_id,
      firstname: "Admin",
      lastname: "User",
      contact_number: "+1234567000",
      address: "DecorVista HQ, Design District",
      gender: "other",
      date_of_birth: "1980-01-01",
    });

    console.log("✅ Admin user created");

    // Create designer accounts
    console.log("🎨 Creating designer accounts...");
    const designers = [];
    for (let i = 0; i < designerProfiles.length; i++) {
      const profile = designerProfiles[i];
      const designer = await User.create({
        username: profile.username,
        email: profile.email,
        password_hash: "designer123", // Will be hashed by the model hook
        role: "designer",
        is_active: true,
        email_verified: true,
      });

      await UserDetails.create({
        user_id: designer.user_id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        contact_number: profile.contact_number,
        address: profile.address,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
      });

      designers.push(designer);
    }

    console.log(`✅ Created ${designers.length} designer accounts`);

    // Create client accounts
    console.log("👥 Creating client accounts...");
    const clients = [];
    for (let i = 0; i < clientProfiles.length; i++) {
      const profile = clientProfiles[i];
      const client = await User.create({
        username: profile.username,
        email: profile.email,
        password_hash: "client123", // Will be hashed by the model hook
        role: "user",
        is_active: true,
        email_verified: true,
      });

      await UserDetails.create({
        user_id: client.user_id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        contact_number: profile.contact_number,
        address: profile.address,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
      });

      clients.push(client);
    }

    console.log(`✅ Created ${clients.length} client accounts`);

    // Create gallery items
    console.log("🖼️ Creating gallery items...");
    const galleryItems = [];
    for (let i = 0; i < galleryData.length; i++) {
      const item = galleryData[i];
      const randomDesigner = getRandomItem(designers);

      const galleryItem = await Gallery.create({
        title: item.title,
        description: item.description,
        image_url: generateImageUrl(item.category, i),
        thumbnail_url: generateImageUrl(item.category, i) + "&w=300&h=200",
        category: item.category,
        style: item.style,
        color_palette: item.color_palette,
        tags: item.tags,
        uploaded_by: randomDesigner.user_id,
        is_featured: Math.random() < 0.3, // 30% chance of being featured
        is_public: true,
        status: "approved",
        view_count: Math.floor(Math.random() * 1000),
        like_count: Math.floor(Math.random() * 100),
      });

      galleryItems.push(galleryItem);
    }

    console.log(`✅ Created ${galleryItems.length} gallery items`);

    // Create consultations
    console.log("📅 Creating consultations...");
    const consultations = [];
    const statuses = [
      "requested",
      "confirmed",
      "completed",
      "cancelled",
      "rescheduled",
    ];
    const consultationTypes = [
      "initial_consultation",
      "design_review",
      "progress_check",
      "final_walkthrough",
      "follow_up",
    ];
    const meetingTypes = ["video_call", "in_person", "phone_call"];

    // Create 25 consultations
    for (let i = 0; i < 25; i++) {
      const randomClient = getRandomItem(clients);
      const randomDesigner = getRandomItem(designers);
      const randomStatus = getRandomItem(statuses);

      // Generate dates - mix of past, present, and future
      let scheduledDate;
      if (i < 8) {
        // Past consultations (completed or cancelled)
        scheduledDate = getRandomDate(
          new Date(2024, 0, 1),
          new Date(2024, 11, 31)
        );
      } else if (i < 15) {
        // Recent consultations
        scheduledDate = getRandomDate(new Date(2024, 10, 1), new Date());
      } else {
        // Future consultations
        scheduledDate = getRandomDate(new Date(), new Date(2025, 2, 31));
      }

      const consultation = await Consultation.create({
        client_id: randomClient.user_id,
        designer_id: randomDesigner.user_id,
        title: getRandomItem(consultationTitles),
        description: getRandomItem(consultationDescriptions),
        consultation_type: getRandomItem(consultationTypes),
        meeting_type: getRandomItem(meetingTypes),
        scheduled_date: scheduledDate,
        duration_minutes: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
        status: randomStatus,
        location:
          randomStatus === "in_person"
            ? `${randomDesigner.user_id} Design Studio, ${["New York", "Los Angeles", "Chicago", "Miami", "Seattle"][Math.floor(Math.random() * 5)]}`
            : "https://meet.decorvista.com/room/" +
              Math.random().toString(36).substring(7),
        client_requirements: getRandomItem(clientRequirements),
        budget_discussed: Math.floor(Math.random() * 50000) + 5000,
        price: Math.floor(Math.random() * 500) + 100,
        payment_status: randomStatus === "completed" ? "paid" : "pending",
        rating:
          randomStatus === "completed"
            ? (Math.random() * 2 + 3).toFixed(1)
            : null, // 3-5 stars
        feedback:
          randomStatus === "completed"
            ? [
                "Excellent consultation! Very professional and helpful.",
                "Great ideas and suggestions. Looking forward to the project.",
                "Designer was knowledgeable and understood my vision perfectly.",
                "Wonderful experience. Highly recommend!",
                "Professional service with creative solutions.",
                "Very satisfied with the consultation and design ideas.",
                "Exceeded my expectations. Great attention to detail.",
                "Helpful and responsive throughout the process.",
              ][Math.floor(Math.random() * 8)]
            : null,
      });

      consultations.push(consultation);
    }

    console.log(`✅ Created ${consultations.length} consultations`);

    // Create projects
    console.log("🏗️ Creating projects...");
    const projects = [];
    const projectStatuses = [
      "draft",
      "submitted",
      "in_review",
      "assigned",
      "in_progress",
      "design_review",
      "approved",
      "completed",
      "cancelled",
    ];
    const projectCategories = [
      "living_room",
      "bedroom",
      "kitchen",
      "bathroom",
      "dining_room",
      "office",
      "outdoor",
      "full_home",
      "other",
    ];
    const stylePreferences = [
      "modern",
      "contemporary",
      "traditional",
      "minimalist",
      "industrial",
      "scandinavian",
      "bohemian",
      "rustic",
      "art_deco",
      "mid_century",
    ];

    // Create 15 projects
    for (let i = 0; i < 15; i++) {
      const randomClient = getRandomItem(clients);
      const randomDesigner = getRandomItem(designers);
      const randomStatus = getRandomItem(projectStatuses);
      const randomCategory = getRandomItem(projectCategories);

      const timelineStart = getRandomDate(new Date(2024, 0, 1), new Date());
      const timelineEnd =
        randomStatus === "completed"
          ? getRandomDate(timelineStart, new Date())
          : getRandomDate(new Date(), new Date(2025, 5, 30));

      const budgetMin = Math.floor(Math.random() * 50000) + 5000;
      const budgetMax = budgetMin + Math.floor(Math.random() * 50000) + 10000;

      const project = await Project.create({
        client_id: randomClient.user_id,
        designer_id: randomDesigner.user_id,
        title: `${getRandomItem(["Modern", "Contemporary", "Traditional", "Scandinavian", "Industrial"])} ${randomCategory.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} ${getRandomItem(["Renovation", "Makeover", "Design", "Remodel"])}`,
        description: `Complete ${getRandomItem(["renovation", "makeover", "redesign"])} project focusing on ${getRandomItem(["functionality", "aesthetics", "comfort", "style", "efficiency"])} and ${getRandomItem(["modern appeal", "timeless design", "practical solutions", "luxury finishes", "sustainable materials"])}.`,
        category: randomCategory,
        style_preference: getRandomItem(stylePreferences),
        budget_min: budgetMin,
        budget_max: budgetMax,
        timeline_start: timelineStart,
        timeline_end: timelineEnd,
        status: randomStatus,
        priority: getRandomItem(["low", "medium", "high", "urgent"]),
        requirements: getRandomItem([
          "Need eco-friendly materials and sustainable design solutions",
          "Looking for smart home integration and modern technology",
          "Want to maximize storage and optimize space utilization",
          "Prefer neutral colors with natural lighting enhancement",
          "Need pet-friendly and child-safe design elements",
          "Looking for luxury finishes within the specified budget",
          "Want to incorporate existing furniture and artwork",
          "Need wheelchair accessible and universal design features",
        ]),
        completion_percentage:
          randomStatus === "completed"
            ? 100
            : randomStatus === "cancelled"
              ? Math.floor(Math.random() * 30)
              : randomStatus === "in_progress"
                ? Math.floor(Math.random() * 70) + 20
                : randomStatus === "assigned"
                  ? Math.floor(Math.random() * 20)
                  : 0,
        rating:
          randomStatus === "completed"
            ? parseFloat((Math.random() * 2 + 3).toFixed(1))
            : null,
        review_text:
          randomStatus === "completed"
            ? getRandomItem([
                "Excellent work! The designer exceeded our expectations.",
                "Beautiful transformation that perfectly matches our vision.",
                "Professional service with attention to every detail.",
                "Outstanding creativity and problem-solving skills.",
                "Highly recommend! Great communication throughout.",
                "Perfect balance of style and functionality.",
                "Amazing results within our budget and timeline.",
              ])
            : null,
      });

      projects.push(project);
    }

    console.log(`✅ Created ${projects.length} projects`);

    // Create reviews
    console.log("⭐ Creating reviews...");
    const reviews = [];
    const reviewComments = [
      "Outstanding work! Exceeded all expectations.",
      "Professional, creative, and delivered on time.",
      "Beautiful design that perfectly matches our style.",
      "Highly recommend! Great attention to detail.",
      "Transformed our space beyond what we imagined.",
      "Excellent communication throughout the project.",
      "Creative solutions for our challenging space.",
      "Perfect balance of style and functionality.",
      "Amazing results within our budget.",
      "Would definitely work with this designer again!",
    ];

    // Create reviews for completed consultations and projects
    const completedConsultations = consultations.filter(
      (c) => c.status === "completed"
    );
    const completedProjects = projects.filter((p) => p.status === "completed");

    // Default values for required fields
    const DEFAULT_REVIEW_TEXT =
      "This user has not provided additional comments.";

    for (const consultation of completedConsultations.slice(0, 8)) {
      const review = await Review.create({
        reviewer_id: consultation.client_id,
        reviewee_id: consultation.designer_id,
        consultation_id: consultation.consultation_id,
        review_type: "consultation_review",
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3-5 stars
        review_text: getRandomItem(reviewComments) || DEFAULT_REVIEW_TEXT,
        is_public: true,
      });
      reviews.push(review);
    }

    for (const project of completedProjects.slice(0, 6)) {
      const review = await Review.create({
        reviewer_id: project.client_id,
        reviewee_id: project.designer_id,
        project_id: project.project_id,
        review_type: "project_review",
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3-5 stars
        review_text: getRandomItem(reviewComments) || DEFAULT_REVIEW_TEXT,
        is_public: true,
      });
      reviews.push(review);
    }

    console.log(`✅ Created ${reviews.length} reviews`);

    // Create notifications
    console.log("🔔 Creating notifications...");
    const notifications = [];
    const notificationTypes = [
      "consultation_scheduled",
      "consultation_reminder",
      "consultation_cancelled",
      "project_update",
      "review_received",
    ];
    const notificationMessages = {
      consultation_scheduled: "New consultation has been scheduled",
      consultation_reminder: "Reminder: Upcoming consultation",
      consultation_cancelled: "A consultation has been cancelled",
      project_update: "Project status has been updated",
      review_received: "You have received a new review",
    };

    // Create notifications for recent activities
    for (let i = 0; i < 20; i++) {
      const randomUser = getRandomItem([...designers, ...clients]);
      const randomSender = getRandomItem([...designers, ...clients, adminUser]);
      const notificationType = getRandomItem(notificationTypes);

      const notification = await Notification.create({
        user_id: randomUser.user_id,
        sender_id:
          randomSender.user_id !== randomUser.user_id
            ? randomSender.user_id
            : null,
        type: notificationType,
        title: notificationMessages[notificationType],
        message: `${notificationMessages[notificationType]}. Click to view details.`,
        is_read: Math.random() < 0.6, // 60% chance of being read
        created_at: getRandomDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        ), // Last 30 days
      });

      notifications.push(notification);
    }

    console.log(`✅ Created ${notifications.length} notifications`);

    // Print summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(
      `👤 Users: ${designers.length + clients.length + 1} (${designers.length} designers, ${clients.length} clients, 1 admin)`
    );
    console.log(`🖼️ Gallery Items: ${galleryItems.length}`);
    console.log(`📅 Consultations: ${consultations.length}`);
    console.log(`🏗️ Projects: ${projects.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);

    console.log("\n🔑 Test Accounts:");
    console.log("Admin: admin@decorvista.com / admin123");
    console.log("Designer: sarah.johnson@decorvista.com / designer123");
    console.log("Client: john.doe@email.com / client123");

    console.log("\n✨ All accounts are email verified and ready to use!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🏁 Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
