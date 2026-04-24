const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS families (
        id SERIAL PRIMARY KEY,
        family_name VARCHAR(200) NOT NULL,
        primary_contact VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        discount_percentage DECIMAL(5,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        level VARCHAR(50) DEFAULT 'Beginner',
        instrument VARCHAR(100),
        parent_name VARCHAR(200),
        parent_email VARCHAR(255),
        parent_phone VARCHAR(20),
        address TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'Active',
        family_id INTEGER,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        specialties TEXT[],
        bio TEXT,
        hourly_rate DECIMAL(10,2),
        commission_rate DECIMAL(5,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Active',
        hire_date DATE DEFAULT CURRENT_DATE,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS instruments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        brand VARCHAR(100),
        model VARCHAR(100),
        serial_number VARCHAR(100),
        condition VARCHAR(50) DEFAULT 'Good',
        purchase_date DATE,
        purchase_price DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Available',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        capacity INTEGER DEFAULT 1,
        equipment TEXT[],
        hourly_rate DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Available',
        floor VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        instrument VARCHAR(100),
        lesson_type VARCHAR(20) DEFAULT 'Private',
        day_of_week VARCHAR(20),
        start_time TIME,
        end_time TIME,
        duration INTEGER DEFAULT 30,
        room_id INTEGER,
        recurring BOOLEAN DEFAULT true,
        status VARCHAR(20) DEFAULT 'Active',
        notes TEXT,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS instrument_rentals (
        id SERIAL PRIMARY KEY,
        instrument_id INTEGER REFERENCES instruments(id),
        student_id INTEGER REFERENCES students(id),
        start_date DATE NOT NULL,
        end_date DATE,
        monthly_rate DECIMAL(10,2),
        deposit DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS recitals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        date DATE,
        time TIME,
        venue VARCHAR(200),
        description TEXT,
        program TEXT,
        status VARCHAR(20) DEFAULT 'Planned',
        max_performers INTEGER,
        ticket_price DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS recital_performers (
        id SERIAL PRIMARY KEY,
        recital_id INTEGER REFERENCES recitals(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        piece_title VARCHAR(200),
        composer VARCHAR(200),
        performance_order INTEGER,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS practice_logs (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        duration_minutes INTEGER,
        piece VARCHAR(200),
        notes TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        teacher_feedback TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        exam_type VARCHAR(100),
        level VARCHAR(50),
        score DECIMAL(5,2),
        date DATE,
        examiner VARCHAR(200),
        status VARCHAR(20) DEFAULT 'Scheduled',
        certificate_issued BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS billing (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        due_date DATE,
        paid_date DATE,
        payment_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'Pending',
        invoice_number VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'Present',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS music_library (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        composer VARCHAR(200),
        arranger VARCHAR(200),
        genre VARCHAR(100),
        difficulty_level VARCHAR(50),
        instrument VARCHAR(100),
        isbn VARCHAR(50),
        publisher VARCHAR(200),
        copies_available INTEGER DEFAULT 1,
        location VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_name VARCHAR(200),
        recipient_type VARCHAR(50),
        recipient_id INTEGER,
        subject VARCHAR(300),
        body TEXT,
        status VARCHAR(20) DEFAULT 'Sent',
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS makeup_lessons (
        id SERIAL PRIMARY KEY,
        original_lesson_id INTEGER REFERENCES lessons(id),
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers(id),
        original_date DATE,
        makeup_date DATE,
        makeup_time TIME,
        room_id INTEGER,
        status VARCHAR(20) DEFAULT 'Scheduled',
        reason TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS summer_camps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        start_date DATE,
        end_date DATE,
        age_group VARCHAR(50),
        instrument_focus VARCHAR(100),
        max_enrollment INTEGER,
        current_enrollment INTEGER DEFAULT 0,
        price DECIMAL(10,2),
        instructor VARCHAR(200),
        description TEXT,
        status VARCHAR(20) DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ensembles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(100),
        director VARCHAR(200),
        rehearsal_day VARCHAR(20),
        rehearsal_time TIME,
        room_id INTEGER,
        max_members INTEGER,
        current_members INTEGER DEFAULT 0,
        level VARCHAR(50),
        status VARCHAR(20) DEFAULT 'Active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ensemble_members (
        id SERIAL PRIMARY KEY,
        ensemble_id INTEGER REFERENCES ensembles(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        instrument VARCHAR(100),
        part VARCHAR(100),
        joined_date DATE DEFAULT CURRENT_DATE
      );

      CREATE TABLE IF NOT EXISTS competitions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        date DATE,
        location VARCHAR(200),
        category VARCHAR(100),
        registration_deadline DATE,
        entry_fee DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Upcoming',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS competition_entries (
        id SERIAL PRIMARY KEY,
        competition_id INTEGER REFERENCES competitions(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        piece VARCHAR(200),
        category VARCHAR(100),
        result VARCHAR(100),
        score DECIMAL(5,2),
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS theory_classes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        level VARCHAR(50),
        teacher_id INTEGER REFERENCES teachers(id),
        day_of_week VARCHAR(20),
        start_time TIME,
        end_time TIME,
        room_id INTEGER,
        max_students INTEGER,
        current_students INTEGER DEFAULT 0,
        price DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Active',
        syllabus TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payroll (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        period_start DATE,
        period_end DATE,
        lessons_count INTEGER,
        hours_worked DECIMAL(10,2),
        base_pay DECIMAL(10,2),
        commission DECIMAL(10,2) DEFAULT 0,
        deductions DECIMAL(10,2) DEFAULT 0,
        total_pay DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Pending',
        paid_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS substitutes (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES teachers(id),
        substitute_teacher_id INTEGER REFERENCES teachers(id),
        lesson_id INTEGER REFERENCES lessons(id),
        date DATE,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'Confirmed',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trial_lessons (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(200) NOT NULL,
        parent_name VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(20),
        instrument VARCHAR(100),
        preferred_date DATE,
        preferred_time TIME,
        teacher_id INTEGER REFERENCES teachers(id),
        status VARCHAR(20) DEFAULT 'Requested',
        notes TEXT,
        converted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS waiting_list (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(200) NOT NULL,
        parent_name VARCHAR(200),
        email VARCHAR(255),
        phone VARCHAR(20),
        instrument VARCHAR(100),
        preferred_day VARCHAR(20),
        preferred_time VARCHAR(50),
        teacher_preference VARCHAR(200),
        priority INTEGER DEFAULT 5,
        status VARCHAR(20) DEFAULT 'Waiting',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS report_cards (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers(id),
        term VARCHAR(50),
        year INTEGER,
        instrument VARCHAR(100),
        technique_grade VARCHAR(5),
        musicality_grade VARCHAR(5),
        theory_grade VARCHAR(5),
        sight_reading_grade VARCHAR(5),
        practice_grade VARCHAR(5),
        overall_grade VARCHAR(5),
        comments TEXT,
        goals TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        type VARCHAR(100),
        title VARCHAR(200),
        date_issued DATE DEFAULT CURRENT_DATE,
        description TEXT,
        level VARCHAR(50),
        issued_by VARCHAR(200),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS merchandise (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        price DECIMAL(10,2),
        cost DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        sku VARCHAR(50),
        status VARCHAR(20) DEFAULT 'In Stock',
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ai_outputs (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        input_data JSONB,
        output_data JSONB,
        model VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('All tables created successfully');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
