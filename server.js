const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('./db'); // mongodb connect
const { Admin, Gallery, HeroSlide, Faculty, Course, Admission, Contact, Notice, Event, Review } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔥 FIX multer path
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// 🔥 HOME ROUTE FIX
app.get("/", (req,res)=>{
  res.send("🔥 School Backend Running Successfully");
});


// ================= LOGIN =================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GALLERY =================
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', upload.array('images'), async (req, res) => {
  try {
    const { category, adminId } = req.body;

    const images = req.files.map(file => ({
      imageUrl: `/uploads/${file.filename}`,
      category: category || 'All',
      uploadedBy: adminId
    }));

    await Gallery.insertMany(images);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= HERO =================
app.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await HeroSlide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hero-slides', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    const slide = new HeroSlide({
      title,
      subtitle,
      imageUrl: `/uploads/${req.file.filename}`
    });

    await slide.save();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= FACULTY =================
app.get('/api/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/faculty', upload.single('image'), async (req, res) => {
  try {
    const { name, department, position, email, phone } = req.body;

    const faculty = new Faculty({
      name,
      department,
      position,
      email,
      phone,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await faculty.save();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/faculty/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, department, position, email, phone } = req.body;
    const updateData = { name, department, position, email, phone };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await Faculty.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/faculty/:id', async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= COURSES =================
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { className, teacherName, studentCount } = req.body;

    const course = new Course({
      className,
      teacherName,
      studentCount
    });

    await course.save();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const { className, teacherName, studentCount } = req.body;
    await Course.findByIdAndUpdate(req.params.id, { className, teacherName, studentCount });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= ADMISSIONS =================
app.get('/api/admissions', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admissions/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admissions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await Admission.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= CONTACTS =================
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await Contact.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= NOTICES =================
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notices', upload.single('image'), async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const noticeData = { title, content, priority };
    
    if (req.file) {
      noticeData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const notice = new Notice(noticeData);
    await notice.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notices/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const updateData = { title, content, priority };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await Notice.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= EVENTS =================
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= REVIEWS =================
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/approve', async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= START SERVER =================
app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));
