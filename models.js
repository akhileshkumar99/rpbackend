const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'All' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

const HeroSlideSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imageUrl: { type: String, required: true },
  displayOrder: Number,
  createdAt: { type: Date, default: Date.now }
});

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: String,
  position: String,
  imageUrl: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
  className: { type: String, required: true },
  teacherName: String,
  studentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const AdmissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: String,
  email: String,
  phone: String,
  class: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  message: String,
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, default: 'Normal' },
  imageUrl: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: String,
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);
const HeroSlide = mongoose.model('HeroSlide', HeroSlideSchema);
const Faculty = mongoose.model('Faculty', FacultySchema);
const Course = mongoose.model('Course', CourseSchema);
const Admission = mongoose.model('Admission', AdmissionSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Notice = mongoose.model('Notice', NoticeSchema);
const Event = mongoose.model('Event', EventSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Create default admin
Admin.findOne({ username: 'admin' }).then(admin => {
  if (!admin) {
    new Admin({ username: 'admin', password: 'admin123', email: 'admin@smartschool.com' }).save();
  }
});

module.exports = { Admin, Gallery, HeroSlide, Faculty, Course, Admission, Contact, Notice, Event, Review };
