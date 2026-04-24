const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Dropping all tables...');
    await client.query(`
      DROP TABLE IF EXISTS ai_outputs CASCADE;
      DROP TABLE IF EXISTS merchandise CASCADE;
      DROP TABLE IF EXISTS certificates CASCADE;
      DROP TABLE IF EXISTS report_cards CASCADE;
      DROP TABLE IF EXISTS waiting_list CASCADE;
      DROP TABLE IF EXISTS trial_lessons CASCADE;
      DROP TABLE IF EXISTS substitutes CASCADE;
      DROP TABLE IF EXISTS payroll CASCADE;
      DROP TABLE IF EXISTS theory_classes CASCADE;
      DROP TABLE IF EXISTS competition_entries CASCADE;
      DROP TABLE IF EXISTS competitions CASCADE;
      DROP TABLE IF EXISTS ensemble_members CASCADE;
      DROP TABLE IF EXISTS ensembles CASCADE;
      DROP TABLE IF EXISTS summer_camps CASCADE;
      DROP TABLE IF EXISTS makeup_lessons CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS music_library CASCADE;
      DROP TABLE IF EXISTS attendance CASCADE;
      DROP TABLE IF EXISTS billing CASCADE;
      DROP TABLE IF EXISTS grades CASCADE;
      DROP TABLE IF EXISTS practice_logs CASCADE;
      DROP TABLE IF EXISTS recital_performers CASCADE;
      DROP TABLE IF EXISTS recitals CASCADE;
      DROP TABLE IF EXISTS instrument_rentals CASCADE;
      DROP TABLE IF EXISTS lessons CASCADE;
      DROP TABLE IF EXISTS rooms CASCADE;
      DROP TABLE IF EXISTS instruments CASCADE;
      DROP TABLE IF EXISTS teachers CASCADE;
      DROP TABLE IF EXISTS students CASCADE;
      DROP TABLE IF EXISTS families CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('Creating tables...');
    await initDB();

    // 1. Users
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
      ['admin@musicschool.com', hashedPassword, 'Admin User', 'admin']
    );

    // 2. Families
    console.log('Seeding families...');
    const families = [
      ['Johnson Family', 'Robert Johnson', 'johnson@email.com', '555-0101', '123 Oak St', 10],
      ['Williams Family', 'Sarah Williams', 'williams@email.com', '555-0102', '456 Elm St', 5],
      ['Brown Family', 'Michael Brown', 'brown@email.com', '555-0103', '789 Pine St', 0],
      ['Davis Family', 'Jennifer Davis', 'davis@email.com', '555-0104', '321 Maple Ave', 15],
      ['Miller Family', 'David Miller', 'miller@email.com', '555-0105', '654 Cedar Ln', 0],
      ['Wilson Family', 'Lisa Wilson', 'wilson@email.com', '555-0106', '987 Birch Dr', 10],
      ['Moore Family', 'James Moore', 'moore@email.com', '555-0107', '147 Walnut St', 5],
      ['Taylor Family', 'Patricia Taylor', 'taylor@email.com', '555-0108', '258 Cherry Ln', 0],
      ['Anderson Family', 'Christopher Anderson', 'anderson@email.com', '555-0109', '369 Spruce Ave', 10],
      ['Thomas Family', 'Nancy Thomas', 'thomas@email.com', '555-0110', '741 Ash St', 0],
      ['Jackson Family', 'Daniel Jackson', 'jackson@email.com', '555-0111', '852 Poplar Dr', 5],
      ['White Family', 'Karen White', 'white@email.com', '555-0112', '963 Willow Ln', 0],
      ['Harris Family', 'Mark Harris', 'harris@email.com', '555-0113', '159 Hickory St', 10],
      ['Martin Family', 'Susan Martin', 'martin@email.com', '555-0114', '357 Sycamore Ave', 5],
      ['Garcia Family', 'Maria Garcia', 'garcia@email.com', '555-0115', '468 Magnolia Dr', 0],
    ];
    for (const f of families) {
      await client.query(
        `INSERT INTO families (family_name, primary_contact, email, phone, address, discount_percentage) VALUES ($1,$2,$3,$4,$5,$6)`,
        f
      );
    }

    // 3. Students
    console.log('Seeding students...');
    const students = [
      ['Emma', 'Johnson', 'emma.j@email.com', '555-1001', '2012-03-15', '2024-09-01', 'Intermediate', 'Piano', 'Robert Johnson', 'johnson@email.com', '555-0101', '123 Oak St', 'Talented young pianist', 'Active', 1],
      ['Liam', 'Williams', 'liam.w@email.com', '555-1002', '2010-07-22', '2024-09-01', 'Advanced', 'Violin', 'Sarah Williams', 'williams@email.com', '555-0102', '456 Elm St', 'Preparing for competition', 'Active', 2],
      ['Sophia', 'Brown', 'sophia.b@email.com', '555-1003', '2013-01-10', '2024-09-15', 'Beginner', 'Flute', 'Michael Brown', 'brown@email.com', '555-0103', '789 Pine St', 'New student, enthusiastic', 'Active', 3],
      ['Noah', 'Davis', 'noah.d@email.com', '555-1004', '2011-11-05', '2024-01-15', 'Intermediate', 'Guitar', 'Jennifer Davis', 'davis@email.com', '555-0104', '321 Maple Ave', 'Enjoys classical guitar', 'Active', 4],
      ['Olivia', 'Miller', 'olivia.m@email.com', '555-1005', '2009-06-20', '2023-09-01', 'Advanced', 'Cello', 'David Miller', 'miller@email.com', '555-0105', '654 Cedar Ln', 'Orchestra member', 'Active', 5],
      ['Ethan', 'Wilson', 'ethan.w@email.com', '555-1006', '2014-02-28', '2024-09-01', 'Beginner', 'Drums', 'Lisa Wilson', 'wilson@email.com', '555-0106', '987 Birch Dr', 'Very energetic', 'Active', 6],
      ['Ava', 'Moore', 'ava.m@email.com', '555-1007', '2012-08-12', '2024-01-10', 'Intermediate', 'Voice', 'James Moore', 'moore@email.com', '555-0107', '147 Walnut St', 'Beautiful soprano', 'Active', 7],
      ['Mason', 'Taylor', 'mason.t@email.com', '555-1008', '2010-04-03', '2023-09-01', 'Advanced', 'Trumpet', 'Patricia Taylor', 'taylor@email.com', '555-0108', '258 Cherry Ln', 'Jazz enthusiast', 'Active', 8],
      ['Isabella', 'Anderson', 'isabella.a@email.com', '555-1009', '2013-09-18', '2024-09-01', 'Beginner', 'Clarinet', 'Christopher Anderson', 'anderson@email.com', '555-0109', '369 Spruce Ave', 'Enjoys band', 'Active', 9],
      ['James', 'Thomas', 'james.t@email.com', '555-1010', '2011-12-25', '2024-01-15', 'Intermediate', 'Saxophone', 'Nancy Thomas', 'thomas@email.com', '555-0110', '741 Ash St', 'Plays alto sax', 'Active', 10],
      ['Mia', 'Jackson', 'mia.j@email.com', '555-1011', '2015-05-08', '2024-09-01', 'Beginner', 'Piano', 'Daniel Jackson', 'jackson@email.com', '555-0111', '852 Poplar Dr', 'Young beginner', 'Active', 11],
      ['Alexander', 'White', 'alex.w@email.com', '555-1012', '2009-10-14', '2023-01-15', 'Advanced', 'Violin', 'Karen White', 'white@email.com', '555-0112', '963 Willow Ln', 'Concertmaster', 'Active', 12],
      ['Charlotte', 'Harris', 'charlotte.h@email.com', '555-1013', '2012-07-30', '2024-09-01', 'Intermediate', 'Harp', 'Mark Harris', 'harris@email.com', '555-0113', '159 Hickory St', 'Graceful player', 'Active', 13],
      ['Benjamin', 'Martin', 'ben.m@email.com', '555-1014', '2010-03-22', '2024-01-15', 'Intermediate', 'Bass Guitar', 'Susan Martin', 'martin@email.com', '555-0114', '357 Sycamore Ave', 'Rock band member', 'Active', 14],
      ['Amelia', 'Garcia', 'amelia.g@email.com', '555-1015', '2013-11-11', '2024-09-15', 'Beginner', 'Oboe', 'Maria Garcia', 'garcia@email.com', '555-0115', '468 Magnolia Dr', 'Double reed beginner', 'Active', 15],
    ];
    for (const s of students) {
      await client.query(
        `INSERT INTO students (first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        s
      );
    }

    // 4. Teachers
    console.log('Seeding teachers...');
    const teachers = [
      ['Maria', 'Rossi', 'maria.rossi@school.com', '555-2001', '{Piano,Music Theory}', 'Concert pianist with 20 years teaching experience', 75.00, 5, 'Active', '2020-01-15'],
      ['David', 'Chen', 'david.chen@school.com', '555-2002', '{Violin,Viola}', 'Former first violinist of the City Symphony', 70.00, 5, 'Active', '2019-06-01'],
      ['Sarah', 'O\'Brien', 'sarah.obrien@school.com', '555-2003', '{Flute,Piccolo}', 'Juilliard graduate with passion for teaching', 65.00, 3, 'Active', '2021-09-01'],
      ['Carlos', 'Mendez', 'carlos.mendez@school.com', '555-2004', '{Guitar,Bass Guitar,Ukulele}', 'Multi-instrumentalist and session musician', 60.00, 5, 'Active', '2020-03-15'],
      ['Emily', 'Watson', 'emily.watson@school.com', '555-2005', '{Cello,Chamber Music}', 'Principal cellist and chamber music coach', 70.00, 4, 'Active', '2018-09-01'],
      ['Marcus', 'Johnson', 'marcus.johnson@school.com', '555-2006', '{Drums,Percussion}', 'Professional drummer touring experience', 55.00, 3, 'Active', '2022-01-10'],
      ['Lisa', 'Park', 'lisa.park@school.com', '555-2007', '{Voice,Choir}', 'Operatic soprano and vocal coach', 65.00, 5, 'Active', '2019-01-15'],
      ['Robert', 'Taylor', 'robert.taylor@school.com', '555-2008', '{Trumpet,Brass Ensemble}', 'Jazz trumpet virtuoso', 60.00, 4, 'Active', '2021-06-01'],
      ['Anna', 'Schmidt', 'anna.schmidt@school.com', '555-2009', '{Clarinet,Woodwinds}', 'Orchestra clarinetist and educator', 60.00, 3, 'Active', '2020-09-01'],
      ['Michael', 'Lee', 'michael.lee@school.com', '555-2010', '{Saxophone,Jazz Studies}', 'Renowned jazz saxophonist', 65.00, 5, 'Active', '2019-03-01'],
      ['Jennifer', 'Adams', 'jennifer.adams@school.com', '555-2011', '{Piano,Composition}', 'Composer and pianist', 70.00, 4, 'Active', '2021-01-15'],
      ['Thomas', 'Wright', 'thomas.wright@school.com', '555-2012', '{Violin,Suzuki Method}', 'Certified Suzuki teacher', 65.00, 3, 'Active', '2020-06-01'],
      ['Rachel', 'Green', 'rachel.green@school.com', '555-2013', '{Harp,Music Theory}', 'Professional harpist', 75.00, 5, 'Active', '2022-09-01'],
      ['Kevin', 'Brown', 'kevin.brown@school.com', '555-2014', '{Bass Guitar,Music Production}', 'Studio musician and producer', 55.00, 3, 'Active', '2021-03-15'],
      ['Sophie', 'Turner', 'sophie.turner@school.com', '555-2015', '{Oboe,English Horn}', 'Symphony oboist', 65.00, 4, 'Active', '2023-01-10'],
    ];
    for (const t of teachers) {
      await client.query(
        `INSERT INTO teachers (first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        t
      );
    }

    // 5. Instruments
    console.log('Seeding instruments...');
    const instruments = [
      ['Yamaha Grand Piano', 'Keyboard', 'Yamaha', 'C3X', 'YP-001', 'Excellent', '2020-01-15', 25000.00, 'In Use'],
      ['Steinway Upright', 'Keyboard', 'Steinway', 'Model K', 'SK-002', 'Good', '2019-06-01', 18000.00, 'Available'],
      ['Student Violin 4/4', 'String', 'Stentor', 'Student II', 'SV-003', 'Good', '2021-09-01', 250.00, 'Rented'],
      ['Student Violin 3/4', 'String', 'Stentor', 'Student II', 'SV-004', 'Good', '2021-09-01', 200.00, 'Available'],
      ['Concert Flute', 'Woodwind', 'Yamaha', 'YFL-222', 'YF-005', 'Excellent', '2022-01-15', 800.00, 'Rented'],
      ['Classical Guitar', 'String', 'Cordoba', 'C5', 'CG-006', 'Good', '2020-03-15', 300.00, 'Rented'],
      ['Student Cello 4/4', 'String', 'Cecilio', 'CCO-100', 'CC-007', 'Good', '2021-01-10', 500.00, 'Rented'],
      ['Drum Kit', 'Percussion', 'Pearl', 'Export', 'PD-008', 'Good', '2020-06-01', 1200.00, 'In Use'],
      ['Trumpet', 'Brass', 'Bach', 'TR300H2', 'BT-009', 'Good', '2021-06-01', 600.00, 'Rented'],
      ['Clarinet', 'Woodwind', 'Buffet', 'B12', 'BC-010', 'Good', '2020-09-01', 700.00, 'Rented'],
      ['Alto Saxophone', 'Woodwind', 'Yamaha', 'YAS-280', 'YS-011', 'Excellent', '2022-03-01', 1100.00, 'Rented'],
      ['Digital Piano', 'Keyboard', 'Roland', 'FP-30X', 'RP-012', 'Excellent', '2023-01-15', 700.00, 'Available'],
      ['Pedal Harp', 'String', 'Lyon & Healy', 'Prelude', 'LH-013', 'Excellent', '2019-09-01', 15000.00, 'In Use'],
      ['Bass Guitar', 'String', 'Fender', 'Player Jazz', 'FJ-014', 'Good', '2021-03-15', 800.00, 'Rented'],
      ['Oboe', 'Woodwind', 'Fox', 'Renard 330', 'FR-015', 'Good', '2023-01-10', 2500.00, 'Rented'],
      ['Electric Guitar', 'String', 'Fender', 'Stratocaster', 'FS-016', 'Excellent', '2022-06-01', 1200.00, 'Available'],
    ];
    for (const i of instruments) {
      await client.query(
        `INSERT INTO instruments (name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        i
      );
    }

    // 6. Rooms
    console.log('Seeding rooms...');
    const rooms = [
      ['Piano Studio A', 2, '{Grand Piano,Music Stand,Metronome}', 40.00, 'Available', '1st'],
      ['Piano Studio B', 2, '{Upright Piano,Music Stand}', 35.00, 'Available', '1st'],
      ['String Room 1', 3, '{Music Stands,Mirror,Tuner}', 30.00, 'Available', '1st'],
      ['String Room 2', 3, '{Music Stands,Mirror}', 30.00, 'Available', '1st'],
      ['Woodwind Room', 2, '{Music Stand,Tuner,Sound Panel}', 30.00, 'Available', '2nd'],
      ['Brass Room', 2, '{Music Stand,Mute Stand,Sound Panel}', 30.00, 'Available', '2nd'],
      ['Drum Studio', 1, '{Drum Kit,Practice Pad,Metronome}', 35.00, 'Available', 'Basement'],
      ['Voice Studio', 2, '{Piano,Mirror,Recording Equipment}', 35.00, 'Available', '2nd'],
      ['Guitar Lab', 4, '{Amplifiers,Music Stands,Tuners}', 25.00, 'Available', '1st'],
      ['Ensemble Room A', 15, '{Music Stands,Chairs,Conductor Stand}', 50.00, 'Available', '1st'],
      ['Ensemble Room B', 10, '{Music Stands,Chairs}', 45.00, 'Available', '2nd'],
      ['Theory Classroom', 20, '{Whiteboard,Piano,Projector}', 40.00, 'Available', '2nd'],
      ['Recording Studio', 3, '{Mixing Console,Microphones,Monitors}', 60.00, 'Available', 'Basement'],
      ['Recital Hall', 100, '{Stage,Grand Piano,Sound System,Lighting}', 150.00, 'Available', '1st'],
      ['Practice Room 1', 1, '{Upright Piano,Music Stand}', 15.00, 'Available', '2nd'],
      ['Practice Room 2', 1, '{Music Stand,Mirror}', 12.00, 'Available', '2nd'],
    ];
    for (const r of rooms) {
      await client.query(
        `INSERT INTO rooms (name, capacity, equipment, hourly_rate, status, floor)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    // 7. Lessons
    console.log('Seeding lessons...');
    const lessons = [
      [1, 1, 'Piano', 'Private', 'Monday', '15:00', '15:30', 30, 1, true, 'Active', null, 45.00],
      [2, 2, 'Violin', 'Private', 'Monday', '16:00', '17:00', 60, 3, true, 'Active', null, 70.00],
      [3, 3, 'Flute', 'Private', 'Tuesday', '15:00', '15:30', 30, 5, true, 'Active', null, 40.00],
      [4, 4, 'Guitar', 'Private', 'Tuesday', '16:00', '16:45', 45, 9, true, 'Active', null, 50.00],
      [5, 5, 'Cello', 'Private', 'Wednesday', '15:00', '16:00', 60, 3, true, 'Active', null, 70.00],
      [6, 6, 'Drums', 'Private', 'Wednesday', '16:00', '16:30', 30, 7, true, 'Active', null, 40.00],
      [7, 7, 'Voice', 'Private', 'Thursday', '15:00', '15:45', 45, 8, true, 'Active', null, 55.00],
      [8, 8, 'Trumpet', 'Private', 'Thursday', '16:00', '17:00', 60, 6, true, 'Active', null, 60.00],
      [9, 9, 'Clarinet', 'Private', 'Friday', '15:00', '15:30', 30, 5, true, 'Active', null, 40.00],
      [10, 10, 'Saxophone', 'Private', 'Friday', '16:00', '17:00', 60, 5, true, 'Active', null, 65.00],
      [11, 1, 'Piano', 'Private', 'Saturday', '09:00', '09:30', 30, 2, true, 'Active', null, 45.00],
      [12, 2, 'Violin', 'Private', 'Saturday', '10:00', '11:00', 60, 4, true, 'Active', null, 70.00],
      [13, 13, 'Harp', 'Private', 'Monday', '17:00', '18:00', 60, 3, true, 'Active', null, 75.00],
      [14, 14, 'Bass Guitar', 'Private', 'Tuesday', '17:00', '17:45', 45, 9, true, 'Active', null, 50.00],
      [15, 15, 'Oboe', 'Private', 'Wednesday', '17:00', '17:30', 30, 5, true, 'Active', null, 45.00],
    ];
    for (const l of lessons) {
      await client.query(
        `INSERT INTO lessons (student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        l
      );
    }

    // 8. Instrument Rentals
    console.log('Seeding rentals...');
    const rentals = [
      [3, 1, '2024-09-01', '2025-06-30', 25.00, 50.00, 'Active'],
      [5, 2, '2024-09-01', '2025-06-30', 30.00, 75.00, 'Active'],
      [6, 3, '2024-09-15', '2025-06-30', 20.00, 40.00, 'Active'],
      [7, 5, '2024-01-15', '2025-06-30', 35.00, 100.00, 'Active'],
      [9, 8, '2024-09-01', '2025-06-30', 25.00, 50.00, 'Active'],
      [10, 9, '2024-09-01', '2025-06-30', 20.00, 40.00, 'Active'],
      [11, 10, '2024-01-15', '2025-06-30', 30.00, 60.00, 'Active'],
      [14, 14, '2024-01-15', '2025-06-30', 25.00, 50.00, 'Active'],
      [15, 15, '2024-09-15', '2025-06-30', 40.00, 100.00, 'Active'],
      [4, 4, '2023-09-01', '2024-06-30', 15.00, 30.00, 'Returned'],
      [3, 6, '2023-09-01', '2024-06-30', 25.00, 50.00, 'Returned'],
      [5, 7, '2023-01-15', '2024-06-30', 30.00, 75.00, 'Returned'],
      [6, 11, '2024-09-01', '2025-06-30', 20.00, 40.00, 'Active'],
      [3, 12, '2024-09-01', '2025-06-30', 30.00, 75.00, 'Active'],
      [10, 13, '2024-09-01', '2025-06-30', 20.00, 40.00, 'Active'],
    ];
    for (const r of rentals) {
      await client.query(
        `INSERT INTO instrument_rentals (instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        r
      );
    }

    // 9. Recitals
    console.log('Seeding recitals...');
    const recitals = [
      ['Winter Showcase 2024', '2024-12-15', '14:00', 'Recital Hall', 'Annual winter student showcase', null, 'Completed', 20, 5.00],
      ['Spring Recital 2025', '2025-04-20', '15:00', 'Recital Hall', 'Spring semester recital', null, 'Planned', 25, 5.00],
      ['Summer Gala 2025', '2025-07-15', '18:00', 'Recital Hall', 'End of summer celebration', null, 'Planned', 30, 10.00],
      ['Fall Showcase 2025', '2025-10-18', '14:00', 'Recital Hall', 'New semester welcome concert', null, 'Planned', 20, 5.00],
      ['Holiday Concert 2025', '2025-12-20', '15:00', 'Recital Hall', 'Holiday themed concert', null, 'Planned', 25, 5.00],
      ['Piano Masterclass Recital', '2025-03-10', '17:00', 'Piano Studio A', 'Piano students showcase', null, 'Planned', 10, 0.00],
      ['String Ensemble Concert', '2025-05-05', '18:00', 'Ensemble Room A', 'String ensemble performance', null, 'Planned', 15, 5.00],
      ['Jazz Night', '2025-06-01', '19:00', 'Recital Hall', 'Jazz students showcase', null, 'Planned', 12, 10.00],
      ['Vocal Recital', '2025-04-05', '16:00', 'Voice Studio', 'Voice student performances', null, 'Planned', 8, 0.00],
      ['Young Artists Concert', '2025-03-22', '14:00', 'Recital Hall', 'Beginner showcase', null, 'Planned', 20, 0.00],
      ['Chamber Music Evening', '2025-05-15', '18:30', 'Ensemble Room A', 'Chamber groups perform', null, 'Planned', 12, 5.00],
      ['Guitar Fiesta', '2025-06-15', '16:00', 'Guitar Lab', 'Guitar students perform', null, 'Planned', 10, 0.00],
      ['Woodwind Showcase', '2025-04-28', '15:00', 'Woodwind Room', 'Woodwind recital', null, 'Planned', 8, 0.00],
      ['Brass & Percussion Night', '2025-05-20', '18:00', 'Ensemble Room B', 'Brass and drums showcase', null, 'Planned', 10, 5.00],
      ['End of Year Gala', '2025-06-28', '18:00', 'Recital Hall', 'Grand end of year celebration', null, 'Planned', 30, 15.00],
    ];
    for (const r of recitals) {
      await client.query(
        `INSERT INTO recitals (title, date, time, venue, description, program, status, max_performers, ticket_price)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        r
      );
    }

    // Recital performers for first recital
    console.log('Seeding recital performers...');
    for (let i = 1; i <= 10; i++) {
      await client.query(
        `INSERT INTO recital_performers (recital_id, student_id, piece_title, composer, performance_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [1, i, ['Fur Elise', 'Concerto in A Minor', 'Sicilienne', 'Romanza', 'The Swan', 'Wipe Out', 'Ave Maria', 'Trumpet Voluntary', 'Clarinet Polka', 'Take Five'][i-1],
         ['Beethoven', 'Vivaldi', 'Faure', 'Anonymous', 'Saint-Saens', 'The Surfaris', 'Schubert', 'Clarke', 'Traditional', 'Desmond'][i-1], i]
      );
    }

    // 10. Practice Logs
    console.log('Seeding practice logs...');
    const practiceLogs = [
      [1, '2025-03-01', 45, 'Fur Elise', 'Working on dynamics', 4, 'Good progress on the B section'],
      [1, '2025-03-02', 30, 'Scales - C Major', 'Hands together practice', 3, null],
      [2, '2025-03-01', 60, 'Concerto in A Minor - Vivaldi', 'Focusing on intonation', 5, 'Excellent bow control'],
      [2, '2025-03-03', 45, 'Scales and Arpeggios', 'Three octave scales', 4, null],
      [3, '2025-03-02', 20, 'Mary Had a Little Lamb', 'First piece!', 3, 'Great start'],
      [4, '2025-03-01', 35, 'Romanza', 'Fingerpicking pattern', 4, 'Smooth transitions'],
      [5, '2025-03-02', 50, 'The Swan - Saint-Saens', 'Legato bowing', 5, 'Beautiful tone production'],
      [6, '2025-03-01', 25, 'Basic Rock Beat', 'Working on steady tempo', 3, 'Keep the hi-hat consistent'],
      [7, '2025-03-03', 40, 'Ave Maria - Schubert', 'Breathing exercises', 4, 'Lovely phrasing'],
      [8, '2025-03-01', 45, 'Trumpet Voluntary', 'High register work', 4, 'Good endurance building'],
      [9, '2025-03-02', 30, 'Clarinet Polka', 'Tonguing exercises', 3, 'Work on staccato'],
      [10, '2025-03-01', 50, 'Take Five', 'Improvisation practice', 5, 'Natural jazz feel'],
      [11, '2025-03-03', 15, 'Twinkle Twinkle', 'First week practice', 3, 'Steady progress'],
      [12, '2025-03-01', 60, 'Bach Partita No. 2', 'Chaconne section', 5, 'Masterful interpretation'],
      [13, '2025-03-02', 40, 'Danses sacree et profane', 'Pedal technique', 4, 'Good pedal changes'],
      [14, '2025-03-01', 35, 'Stand By Me', 'Bass line groove', 4, null],
      [15, '2025-03-03', 25, 'Long tones', 'Embouchure building', 3, 'Patience with tone development'],
    ];
    for (const pl of practiceLogs) {
      await client.query(
        `INSERT INTO practice_logs (student_id, date, duration_minutes, piece, notes, rating, teacher_feedback)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        pl
      );
    }

    // 11. Grades
    console.log('Seeding grades...');
    const grades = [
      [1, 'ABRSM', 'Grade 4', 85.00, '2025-01-15', 'Dr. Smith', 'Passed', true],
      [2, 'ABRSM', 'Grade 7', 92.00, '2025-01-20', 'Prof. Jones', 'Passed', true],
      [3, 'ABRSM', 'Grade 1', null, '2025-06-15', 'Dr. Smith', 'Scheduled', false],
      [4, 'RCM', 'Level 5', 78.00, '2024-12-10', 'Ms. Davis', 'Passed', true],
      [5, 'ABRSM', 'Grade 8', 95.00, '2024-11-20', 'Prof. Jones', 'Passed', true],
      [6, 'Trinity', 'Grade 2', null, '2025-07-01', 'Mr. Wilson', 'Scheduled', false],
      [7, 'ABRSM', 'Grade 5', 88.00, '2025-02-10', 'Dr. Smith', 'Passed', true],
      [8, 'ABRSM', 'Grade 6', 82.00, '2024-12-15', 'Prof. Jones', 'Passed', true],
      [9, 'ABRSM', 'Grade 2', null, '2025-06-20', 'Dr. Smith', 'Scheduled', false],
      [10, 'RCM', 'Level 5', 85.00, '2025-01-25', 'Ms. Davis', 'Passed', true],
      [11, 'ABRSM', 'Prep Test', null, '2025-06-25', 'Dr. Smith', 'Scheduled', false],
      [12, 'ABRSM', 'Grade 8', 98.00, '2024-10-15', 'Prof. Jones', 'Passed', true],
      [13, 'Trinity', 'Grade 4', 80.00, '2025-02-01', 'Mr. Wilson', 'Passed', true],
      [14, 'RCM', 'Level 4', 75.00, '2024-12-20', 'Ms. Davis', 'Passed', true],
      [15, 'ABRSM', 'Grade 1', null, '2025-07-10', 'Dr. Smith', 'Scheduled', false],
    ];
    for (const g of grades) {
      await client.query(
        `INSERT INTO grades (student_id, exam_type, level, score, date, examiner, status, certificate_issued)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        g
      );
    }

    // 12. Billing
    console.log('Seeding billing...');
    const billingRecords = [
      [1, 180.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-01', 'Credit Card', 'Paid', 'INV-2025-001'],
      [2, 280.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-02', 'Bank Transfer', 'Paid', 'INV-2025-002'],
      [3, 160.00, 'Monthly tuition - March 2025', '2025-03-01', null, null, 'Pending', 'INV-2025-003'],
      [4, 200.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-01', 'Credit Card', 'Paid', 'INV-2025-004'],
      [5, 280.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-05', 'Check', 'Paid', 'INV-2025-005'],
      [6, 160.00, 'Monthly tuition - March 2025', '2025-03-01', null, null, 'Pending', 'INV-2025-006'],
      [7, 220.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-01', 'Credit Card', 'Paid', 'INV-2025-007'],
      [8, 240.00, 'Monthly tuition - March 2025', '2025-03-01', null, null, 'Overdue', 'INV-2025-008'],
      [9, 160.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-03', 'Cash', 'Paid', 'INV-2025-009'],
      [10, 260.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-01', 'Credit Card', 'Paid', 'INV-2025-010'],
      [11, 180.00, 'Monthly tuition - March 2025', '2025-03-01', null, null, 'Pending', 'INV-2025-011'],
      [12, 280.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-01', 'Bank Transfer', 'Paid', 'INV-2025-012'],
      [13, 300.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-04', 'Credit Card', 'Paid', 'INV-2025-013'],
      [14, 200.00, 'Monthly tuition - March 2025', '2025-03-01', null, null, 'Pending', 'INV-2025-014'],
      [15, 180.00, 'Monthly tuition - March 2025', '2025-03-01', '2025-03-02', 'Credit Card', 'Paid', 'INV-2025-015'],
    ];
    for (const b of billingRecords) {
      await client.query(
        `INSERT INTO billing (student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        b
      );
    }

    // 13. Attendance
    console.log('Seeding attendance...');
    const attendanceRecords = [
      [1, 1, '2025-03-03', 'Present', null],
      [2, 2, '2025-03-03', 'Present', null],
      [3, 3, '2025-03-04', 'Present', null],
      [4, 4, '2025-03-04', 'Late', 'Arrived 10 min late'],
      [5, 5, '2025-03-05', 'Present', null],
      [6, 6, '2025-03-05', 'Absent', 'Sick'],
      [7, 7, '2025-03-06', 'Present', null],
      [8, 8, '2025-03-06', 'Present', null],
      [9, 9, '2025-03-07', 'Present', null],
      [10, 10, '2025-03-07', 'Present', null],
      [11, 11, '2025-03-08', 'Late', 'Traffic'],
      [12, 12, '2025-03-08', 'Present', null],
      [13, 13, '2025-03-03', 'Present', null],
      [14, 14, '2025-03-04', 'Absent', 'Family vacation'],
      [15, 15, '2025-03-05', 'Present', null],
    ];
    for (const a of attendanceRecords) {
      await client.query(
        `INSERT INTO attendance (lesson_id, student_id, date, status, notes)
         VALUES ($1,$2,$3,$4,$5)`,
        a
      );
    }

    // 14. Music Library
    console.log('Seeding music library...');
    const musicLibraryItems = [
      ['Fur Elise', 'Beethoven', null, 'Classical', 'Intermediate', 'Piano', '978-0-001', 'Henle', 3, 'Shelf A1'],
      ['Suzuki Violin School Vol. 1', 'Suzuki', null, 'Method Book', 'Beginner', 'Violin', '978-0-002', 'Summy-Birchard', 5, 'Shelf B1'],
      ['The Flute Player Book 1', 'Wye', null, 'Method Book', 'Beginner', 'Flute', '978-0-003', 'Novello', 3, 'Shelf C1'],
      ['Classical Guitar Method', 'Noad', null, 'Method Book', 'Beginner', 'Guitar', '978-0-004', 'Schirmer', 4, 'Shelf D1'],
      ['Cello Suites', 'Bach', null, 'Classical', 'Advanced', 'Cello', '978-0-005', 'Barenreiter', 2, 'Shelf B2'],
      ['Stick Control', 'Stone', null, 'Method Book', 'All Levels', 'Drums', '978-0-006', 'Alfred', 3, 'Shelf E1'],
      ['24 Italian Songs and Arias', 'Various', null, 'Vocal', 'Intermediate', 'Voice', '978-0-007', 'Schirmer', 4, 'Shelf F1'],
      ['Arban Complete Method', 'Arban', null, 'Method Book', 'All Levels', 'Trumpet', '978-0-008', 'Carl Fischer', 2, 'Shelf G1'],
      ['Klose Complete Method', 'Klose', null, 'Method Book', 'Intermediate', 'Clarinet', '978-0-009', 'Carl Fischer', 2, 'Shelf C2'],
      ['Charlie Parker Omnibook', 'Parker', null, 'Jazz', 'Advanced', 'Saxophone', '978-0-010', 'Hal Leonard', 3, 'Shelf G2'],
      ['Hanon Virtuoso Pianist', 'Hanon', null, 'Method Book', 'All Levels', 'Piano', '978-0-011', 'Schirmer', 5, 'Shelf A2'],
      ['Suzuki Violin School Vol. 4', 'Suzuki', null, 'Method Book', 'Intermediate', 'Violin', '978-0-012', 'Summy-Birchard', 3, 'Shelf B1'],
      ['Salzedo Method for Harp', 'Salzedo', null, 'Method Book', 'Intermediate', 'Harp', '978-0-013', 'Schirmer', 1, 'Shelf H1'],
      ['Hal Leonard Bass Method', 'Friedland', null, 'Method Book', 'Beginner', 'Bass Guitar', '978-0-014', 'Hal Leonard', 3, 'Shelf D2'],
      ['Barret Oboe Method', 'Barret', null, 'Method Book', 'Intermediate', 'Oboe', '978-0-015', 'Boosey', 2, 'Shelf C3'],
      ['Music Theory in Practice Grade 5', 'ABRSM', null, 'Theory', 'Intermediate', 'All', '978-0-016', 'ABRSM', 6, 'Shelf I1'],
    ];
    for (const ml of musicLibraryItems) {
      await client.query(
        `INSERT INTO music_library (title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        ml
      );
    }

    // 15. Messages
    console.log('Seeding messages...');
    const messages = [
      ['Admin', 'all', null, 'Welcome to Spring Semester!', 'Dear families, welcome to our spring semester. We have exciting events planned!', 'Sent', false],
      ['Admin', 'student', 1, 'Lesson Schedule Update', 'Your Monday lesson has been moved to 3:30 PM starting next week.', 'Sent', true],
      ['Maria Rossi', 'student', 1, 'Practice Assignment', 'Please focus on measures 24-32 of Fur Elise this week.', 'Sent', true],
      ['Admin', 'teacher', 2, 'Schedule Change', 'Please note the room change for your Tuesday lessons.', 'Sent', false],
      ['Sarah Williams', 'admin', null, 'Request for Makeup Lesson', 'Liam will miss his lesson on March 10. Can we schedule a makeup?', 'Sent', true],
      ['Admin', 'all', null, 'Spring Recital Information', 'Spring Recital will be on April 20. Please confirm participation.', 'Sent', false],
      ['David Chen', 'student', 2, 'Competition Preparation', 'Please prepare the Vivaldi concerto movements 1 and 3 for the competition.', 'Sent', true],
      ['Admin', 'student', 8, 'Payment Reminder', 'Your March tuition payment is overdue. Please remit at your earliest convenience.', 'Sent', false],
      ['Lisa Park', 'student', 7, 'Voice Lesson Update', 'Great progress on Ave Maria! Let us work on breathing exercises next week.', 'Sent', true],
      ['Admin', 'all', null, 'Summer Camp Registration Open', 'Summer camp registration is now open! Early bird pricing available until April 15.', 'Sent', false],
      ['Jennifer Davis', 'admin', null, 'Billing Question', 'Can you explain the charges on Noah\'s March invoice?', 'Sent', true],
      ['Admin', 'teacher', 6, 'New Student Assignment', 'You have a new drum student starting next Wednesday.', 'Sent', false],
      ['Carlos Mendez', 'student', 4, 'Guitar Strings', 'Time to change your guitar strings. Please bring a new set next lesson.', 'Sent', true],
      ['Admin', 'all', null, 'School Closed - Holiday', 'The school will be closed on April 18-21 for Easter break.', 'Sent', false],
      ['Karen White', 'admin', null, 'Alexander Concert', 'Alexander has been invited to perform at the regional orchestra. Need recommendation letter.', 'Sent', true],
    ];
    for (const m of messages) {
      await client.query(
        `INSERT INTO messages (sender_name, recipient_type, recipient_id, subject, body, status, read)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        m
      );
    }

    // 16. Makeup Lessons
    console.log('Seeding makeup lessons...');
    const makeupLessons = [
      [2, 2, 2, '2025-03-10', '2025-03-12', '16:00', 3, 'Scheduled', 'Family event', null],
      [6, 6, 6, '2025-03-05', '2025-03-08', '10:00', 7, 'Completed', 'Sick', null],
      [1, 1, 1, '2025-02-17', '2025-02-19', '15:00', 1, 'Completed', 'Snow day', null],
      [4, 4, 4, '2025-03-04', '2025-03-07', '14:00', 9, 'Scheduled', 'Doctor appointment', null],
      [8, 8, 8, '2025-02-27', '2025-03-01', '16:00', 6, 'Completed', 'Teacher sick', null],
      [3, 3, 3, '2025-03-11', '2025-03-14', '15:00', 5, 'Scheduled', 'School field trip', null],
      [5, 5, 5, '2025-02-26', '2025-02-28', '15:00', 3, 'Completed', 'Holiday', null],
      [7, 7, 7, '2025-03-13', '2025-03-15', '11:00', 8, 'Scheduled', 'Voice rest needed', null],
      [9, 9, 9, '2025-03-07', '2025-03-10', '14:00', 5, 'Scheduled', 'Competition travel', null],
      [10, 10, 10, '2025-02-21', '2025-02-24', '16:00', 5, 'Completed', 'Flu', null],
      [11, 11, 1, '2025-03-08', '2025-03-10', '09:00', 2, 'Scheduled', 'Family trip', null],
      [12, 12, 2, '2025-02-15', '2025-02-17', '10:00', 4, 'Completed', 'Orchestra rehearsal', null],
      [13, 13, 13, '2025-03-03', '2025-03-05', '17:00', 3, 'Completed', 'Harp maintenance', null],
      [14, 14, 14, '2025-03-11', '2025-03-13', '17:00', 9, 'Scheduled', 'School event', null],
      [15, 15, 15, '2025-03-05', '2025-03-07', '17:00', 5, 'Scheduled', 'Doctor visit', null],
    ];
    for (const ml of makeupLessons) {
      await client.query(
        `INSERT INTO makeup_lessons (original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        ml
      );
    }

    // 17. Summer Camps
    console.log('Seeding summer camps...');
    const summerCamps = [
      ['Piano Intensive Camp', '2025-06-16', '2025-06-27', '8-14', 'Piano', 15, 8, 450.00, 'Maria Rossi', 'Two-week piano intensive with daily masterclasses', 'Open'],
      ['String Orchestra Camp', '2025-07-07', '2025-07-18', '10-18', 'Strings', 25, 12, 550.00, 'David Chen', 'Ensemble playing and solo performance', 'Open'],
      ['Rock Band Camp', '2025-06-23', '2025-06-27', '12-18', 'Guitar/Drums/Bass', 12, 5, 300.00, 'Carlos Mendez', 'Form a band and perform at the end-of-camp concert', 'Open'],
      ['Young Musicians Camp', '2025-07-14', '2025-07-25', '5-8', 'All', 20, 10, 400.00, 'Jennifer Adams', 'Introduction to music through play and exploration', 'Open'],
      ['Jazz Workshop', '2025-07-28', '2025-08-01', '14-18', 'Jazz Instruments', 15, 3, 350.00, 'Michael Lee', 'Jazz improvisation and combo playing', 'Open'],
      ['Vocal Performance Camp', '2025-06-16', '2025-06-20', '10-16', 'Voice', 12, 6, 250.00, 'Lisa Park', 'Singing technique, stage presence, and performance', 'Open'],
      ['Composition Workshop', '2025-08-04', '2025-08-08', '12-18', 'Composition', 10, 2, 300.00, 'Jennifer Adams', 'Write your own music in one week', 'Open'],
      ['Brass Camp', '2025-07-21', '2025-07-25', '10-16', 'Brass', 12, 4, 275.00, 'Robert Taylor', 'Brass ensemble and solo techniques', 'Open'],
      ['Woodwind Workshop', '2025-08-11', '2025-08-15', '10-16', 'Woodwinds', 12, 3, 275.00, 'Anna Schmidt', 'Woodwind technique and ensemble', 'Open'],
      ['Music Theory Boot Camp', '2025-06-30', '2025-07-03', '12-18', 'Theory', 20, 8, 200.00, 'Maria Rossi', 'Intensive theory preparation for exams', 'Open'],
      ['Chamber Music Retreat', '2025-08-18', '2025-08-22', '14-18', 'Chamber', 16, 0, 400.00, 'Emily Watson', 'Form chamber groups and perform', 'Open'],
      ['Percussion Intensive', '2025-07-07', '2025-07-11', '8-16', 'Percussion', 10, 4, 250.00, 'Marcus Johnson', 'All percussion instruments exploration', 'Open'],
      ['Musical Theater Camp', '2025-06-23', '2025-07-04', '10-16', 'Voice/Acting', 20, 15, 500.00, 'Lisa Park', 'Put on a mini musical production', 'Open'],
      ['Harp Intensive', '2025-08-04', '2025-08-08', '10-18', 'Harp', 6, 1, 350.00, 'Rachel Green', 'Intensive harp study week', 'Open'],
      ['Suzuki Family Camp', '2025-07-14', '2025-07-18', '4-10', 'Violin', 15, 7, 350.00, 'Thomas Wright', 'Parent-child music making', 'Open'],
    ];
    for (const sc of summerCamps) {
      await client.query(
        `INSERT INTO summer_camps (name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        sc
      );
    }

    // 18. Ensembles
    console.log('Seeding ensembles...');
    const ensembles = [
      ['Junior String Ensemble', 'String Orchestra', 'David Chen', 'Saturday', '10:00', 10, 15, 8, 'Beginner', 'Active'],
      ['Senior String Orchestra', 'String Orchestra', 'Emily Watson', 'Saturday', '11:30', 10, 25, 15, 'Advanced', 'Active'],
      ['Wind Ensemble', 'Wind Band', 'Anna Schmidt', 'Thursday', '17:00', 11, 20, 12, 'Intermediate', 'Active'],
      ['Jazz Combo A', 'Jazz', 'Michael Lee', 'Wednesday', '18:00', 10, 6, 4, 'Advanced', 'Active'],
      ['Jazz Combo B', 'Jazz', 'Robert Taylor', 'Friday', '18:00', 10, 6, 3, 'Intermediate', 'Active'],
      ['Chamber Strings', 'Chamber', 'David Chen', 'Tuesday', '18:00', 3, 4, 4, 'Advanced', 'Active'],
      ['Choir', 'Vocal', 'Lisa Park', 'Wednesday', '17:00', 11, 30, 20, 'All Levels', 'Active'],
      ['Guitar Ensemble', 'Guitar', 'Carlos Mendez', 'Thursday', '18:00', 9, 8, 5, 'Intermediate', 'Active'],
      ['Brass Quintet', 'Brass', 'Robert Taylor', 'Monday', '18:00', 10, 5, 4, 'Advanced', 'Active'],
      ['Flute Choir', 'Woodwind', 'Sarah O\'Brien', 'Tuesday', '17:00', 5, 8, 5, 'Intermediate', 'Active'],
      ['Percussion Ensemble', 'Percussion', 'Marcus Johnson', 'Friday', '17:00', 7, 8, 6, 'All Levels', 'Active'],
      ['Piano Duo/Trio', 'Piano', 'Maria Rossi', 'Saturday', '13:00', 1, 3, 3, 'Advanced', 'Active'],
      ['Young Musicians Ensemble', 'Mixed', 'Jennifer Adams', 'Saturday', '09:00', 10, 15, 10, 'Beginner', 'Active'],
      ['Harp Duo', 'Harp', 'Rachel Green', 'Monday', '17:00', 3, 2, 2, 'Intermediate', 'Active'],
      ['Rock Band', 'Rock', 'Kevin Brown', 'Friday', '19:00', 10, 5, 4, 'Intermediate', 'Active'],
    ];
    for (const e of ensembles) {
      await client.query(
        `INSERT INTO ensembles (name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        e
      );
    }

    // Ensemble members
    console.log('Seeding ensemble members...');
    const ensembleMembers = [
      [1, 3, 'Violin', '2nd Violin'], [1, 9, 'Clarinet', 'Guest'], [1, 11, 'Piano', 'Accompanist'],
      [2, 2, 'Violin', 'Concertmaster'], [2, 5, 'Cello', 'Principal'], [2, 12, 'Violin', '1st Violin'],
      [4, 10, 'Saxophone', 'Lead'], [4, 8, 'Trumpet', 'Soloist'],
      [7, 7, 'Voice', 'Soprano'], [7, 1, 'Voice', 'Alto'],
    ];
    for (const em of ensembleMembers) {
      await client.query(
        `INSERT INTO ensemble_members (ensemble_id, student_id, instrument, part) VALUES ($1,$2,$3,$4)`,
        em
      );
    }

    // 19. Competitions
    console.log('Seeding competitions...');
    const competitions = [
      ['State Piano Competition', '2025-04-15', 'City Concert Hall', 'Solo Piano', '2025-03-15', 50.00, 'Upcoming'],
      ['Regional Young Artists', '2025-05-10', 'University Auditorium', 'All Instruments', '2025-04-10', 75.00, 'Upcoming'],
      ['National Music Festival', '2025-06-20', 'National Arts Center', 'All Categories', '2025-05-01', 100.00, 'Upcoming'],
      ['City String Competition', '2025-04-28', 'City Hall', 'Strings', '2025-03-28', 45.00, 'Upcoming'],
      ['Jazz Festival Competition', '2025-05-25', 'Jazz Club Downtown', 'Jazz', '2025-04-25', 35.00, 'Upcoming'],
      ['Vocal Arts Competition', '2025-06-05', 'Opera House', 'Voice', '2025-05-05', 60.00, 'Upcoming'],
      ['Chamber Music Challenge', '2025-05-18', 'University Hall', 'Chamber', '2025-04-18', 40.00, 'Upcoming'],
      ['Guitar Masters', '2025-04-22', 'Cultural Center', 'Guitar', '2025-03-22', 45.00, 'Upcoming'],
      ['Woodwind Showcase', '2025-05-30', 'Community Center', 'Woodwinds', '2025-04-30', 40.00, 'Upcoming'],
      ['Brass Festival', '2025-06-10', 'Band Hall', 'Brass', '2025-05-10', 45.00, 'Upcoming'],
      ['Winter Concerto Competition', '2025-12-01', 'Symphony Hall', 'Concerto', '2025-11-01', 80.00, 'Upcoming'],
      ['Young Composers Award', '2025-07-15', 'Music Academy', 'Composition', '2025-06-15', 30.00, 'Upcoming'],
      ['Percussion Solo Contest', '2025-05-12', 'Percussion Center', 'Percussion', '2025-04-12', 35.00, 'Upcoming'],
      ['Harp Competition', '2025-06-25', 'Harp Society Hall', 'Harp', '2025-05-25', 55.00, 'Upcoming'],
      ['Music Theory Olympiad', '2025-04-05', 'School Auditorium', 'Theory', '2025-03-20', 20.00, 'Upcoming'],
    ];
    for (const c of competitions) {
      await client.query(
        `INSERT INTO competitions (name, date, location, category, registration_deadline, entry_fee, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        c
      );
    }

    // Competition entries
    console.log('Seeding competition entries...');
    const competitionEntries = [
      [1, 1, 'Fur Elise - Beethoven', 'Intermediate Piano', null, null],
      [1, 11, 'Sonatina in C - Clementi', 'Beginner Piano', null, null],
      [2, 2, 'Concerto in A Minor - Vivaldi', 'Advanced Strings', null, null],
      [2, 5, 'The Swan - Saint-Saens', 'Advanced Strings', null, null],
      [4, 12, 'Bach Partita No. 2', 'Advanced Strings', null, null],
      [5, 10, 'Take Five - Desmond', 'Jazz Solo', null, null],
      [5, 8, 'Round Midnight - Monk', 'Jazz Solo', null, null],
      [6, 7, 'Ave Maria - Schubert', 'Classical Voice', null, null],
      [8, 4, 'Romanza - Anonymous', 'Classical Guitar', null, null],
      [14, 13, 'Danses sacree et profane', 'Harp Solo', null, null],
    ];
    for (const ce of competitionEntries) {
      await client.query(
        `INSERT INTO competition_entries (competition_id, student_id, piece, category, result, score)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        ce
      );
    }

    // 20. Theory Classes
    console.log('Seeding theory classes...');
    const theoryClasses = [
      ['Music Theory Grade 1', 'Grade 1', 1, 'Monday', '14:00', '14:45', 12, 12, 8, 25.00, 'Active', 'Basic note reading, rhythms, and key signatures'],
      ['Music Theory Grade 2', 'Grade 2', 1, 'Monday', '15:00', '15:45', 12, 12, 6, 25.00, 'Active', 'Intervals, scales, and time signatures'],
      ['Music Theory Grade 3', 'Grade 3', 11, 'Tuesday', '14:00', '14:45', 12, 12, 5, 30.00, 'Active', 'Transposition, chords, and cadences'],
      ['Music Theory Grade 4', 'Grade 4', 11, 'Tuesday', '15:00', '15:45', 12, 12, 4, 30.00, 'Active', 'Ornaments, modulation, and analysis'],
      ['Music Theory Grade 5', 'Grade 5', 1, 'Wednesday', '14:00', '14:45', 12, 15, 7, 35.00, 'Active', 'Counterpoint, composition, and harmony'],
      ['Ear Training Beginner', 'Beginner', 7, 'Thursday', '14:00', '14:45', 12, 10, 5, 25.00, 'Active', 'Interval recognition and rhythm dictation'],
      ['Ear Training Advanced', 'Advanced', 7, 'Thursday', '15:00', '15:45', 12, 10, 3, 30.00, 'Active', 'Harmonic dictation and sight-singing'],
      ['Music History Survey', 'All Levels', 11, 'Friday', '14:00', '15:00', 12, 20, 10, 30.00, 'Active', 'Overview of Western music history'],
      ['Jazz Theory', 'Intermediate', 10, 'Wednesday', '18:00', '19:00', 12, 12, 4, 35.00, 'Active', 'Jazz harmony, chord symbols, and improvisation theory'],
      ['Composition Workshop', 'Intermediate', 11, 'Saturday', '14:00', '15:30', 12, 8, 3, 40.00, 'Active', 'Learn to compose for various instruments'],
      ['Sight-Reading Class', 'All Levels', 1, 'Thursday', '16:00', '16:45', 12, 10, 6, 25.00, 'Active', 'Improve sight-reading skills'],
      ['AP Music Theory Prep', 'Advanced', 1, 'Saturday', '10:00', '11:30', 12, 12, 5, 45.00, 'Active', 'Prepare for the AP Music Theory exam'],
      ['Rhythm Workshop', 'Beginner', 6, 'Friday', '15:00', '15:45', 12, 12, 4, 25.00, 'Active', 'Master complex rhythms and time signatures'],
      ['Film Music Scoring', 'Advanced', 11, 'Saturday', '15:30', '17:00', 12, 8, 2, 45.00, 'Active', 'Score music for film and media'],
      ['Music Technology', 'Intermediate', 14, 'Wednesday', '16:00', '17:00', 13, 6, 3, 35.00, 'Active', 'DAW basics, recording, and production'],
    ];
    for (const tc of theoryClasses) {
      await client.query(
        `INSERT INTO theory_classes (name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        tc
      );
    }

    // 21. Payroll
    console.log('Seeding payroll...');
    const payrollRecords = [
      [1, '2025-02-01', '2025-02-28', 16, 24, 1800.00, 90.00, 0, 1890.00, 'Paid', '2025-03-01'],
      [2, '2025-02-01', '2025-02-28', 14, 21, 1470.00, 73.50, 0, 1543.50, 'Paid', '2025-03-01'],
      [3, '2025-02-01', '2025-02-28', 12, 12, 780.00, 23.40, 0, 803.40, 'Paid', '2025-03-01'],
      [4, '2025-02-01', '2025-02-28', 16, 18, 1080.00, 54.00, 0, 1134.00, 'Paid', '2025-03-01'],
      [5, '2025-02-01', '2025-02-28', 10, 15, 1050.00, 42.00, 0, 1092.00, 'Paid', '2025-03-01'],
      [6, '2025-02-01', '2025-02-28', 12, 9, 495.00, 14.85, 0, 509.85, 'Paid', '2025-03-01'],
      [7, '2025-02-01', '2025-02-28', 14, 14, 910.00, 45.50, 0, 955.50, 'Paid', '2025-03-01'],
      [8, '2025-02-01', '2025-02-28', 10, 12, 720.00, 28.80, 0, 748.80, 'Paid', '2025-03-01'],
      [9, '2025-02-01', '2025-02-28', 10, 8, 480.00, 14.40, 0, 494.40, 'Paid', '2025-03-01'],
      [10, '2025-02-01', '2025-02-28', 12, 14, 910.00, 45.50, 0, 955.50, 'Paid', '2025-03-01'],
      [11, '2025-02-01', '2025-02-28', 14, 18, 1260.00, 50.40, 0, 1310.40, 'Paid', '2025-03-01'],
      [12, '2025-02-01', '2025-02-28', 12, 12, 780.00, 23.40, 0, 803.40, 'Paid', '2025-03-01'],
      [13, '2025-02-01', '2025-02-28', 8, 10, 750.00, 37.50, 0, 787.50, 'Paid', '2025-03-01'],
      [14, '2025-02-01', '2025-02-28', 10, 10, 550.00, 16.50, 0, 566.50, 'Paid', '2025-03-01'],
      [15, '2025-02-01', '2025-02-28', 8, 6, 390.00, 15.60, 0, 405.60, 'Paid', '2025-03-01'],
    ];
    for (const p of payrollRecords) {
      await client.query(
        `INSERT INTO payroll (teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        p
      );
    }

    // 22. Substitutes
    console.log('Seeding substitutes...');
    const substitutes = [
      [1, 11, 1, '2025-03-17', 'Conference attendance', 'Confirmed'],
      [2, 12, 2, '2025-03-10', 'Personal day', 'Confirmed'],
      [3, 9, 3, '2025-02-25', 'Sick leave', 'Completed'],
      [4, 14, 4, '2025-03-18', 'Family emergency', 'Confirmed'],
      [5, 2, 5, '2025-02-19', 'Concert performance', 'Completed'],
      [6, 14, 6, '2025-03-12', 'Sick leave', 'Confirmed'],
      [7, 1, 7, '2025-03-20', 'Workshop', 'Confirmed'],
      [8, 10, 8, '2025-02-27', 'Travel', 'Completed'],
      [9, 3, 9, '2025-03-14', 'Doctor appointment', 'Confirmed'],
      [10, 8, 10, '2025-02-21', 'Recording session', 'Completed'],
      [1, 11, 11, '2025-03-22', 'Jury duty', 'Pending'],
      [2, 5, 12, '2025-03-15', 'Orchestra rehearsal', 'Confirmed'],
      [13, 1, 13, '2025-03-03', 'Harp festival', 'Completed'],
      [14, 4, 14, '2025-03-25', 'Gig', 'Pending'],
      [15, 9, 15, '2025-03-05', 'Illness', 'Completed'],
    ];
    for (const s of substitutes) {
      await client.query(
        `INSERT INTO substitutes (teacher_id, substitute_teacher_id, lesson_id, date, reason, status)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        s
      );
    }

    // 23. Trial Lessons
    console.log('Seeding trial lessons...');
    const trialLessons = [
      ['Sophie Martinez', 'Carlos Martinez', 'smartinez@email.com', '555-3001', 'Piano', '2025-03-20', '14:00', 1, 'Scheduled', null, false],
      ['Oliver Kim', 'Grace Kim', 'gkim@email.com', '555-3002', 'Violin', '2025-03-21', '15:00', 2, 'Scheduled', null, false],
      ['Luna Patel', 'Raj Patel', 'rpatel@email.com', '555-3003', 'Flute', '2025-03-22', '14:00', 3, 'Requested', null, false],
      ['Aiden O\'Connor', 'Sean O\'Connor', 'soconnor@email.com', '555-3004', 'Guitar', '2025-03-19', '16:00', 4, 'Completed', 'Very enthusiastic', true],
      ['Zoe Chen', 'Wei Chen', 'wchen@email.com', '555-3005', 'Cello', '2025-03-25', '15:00', 5, 'Scheduled', null, false],
      ['Max Thompson', 'Julie Thompson', 'jthompson@email.com', '555-3006', 'Drums', '2025-03-18', '16:00', 6, 'Completed', 'Signed up for lessons', true],
      ['Aria Nguyen', 'Tran Nguyen', 'tnguyen@email.com', '555-3007', 'Voice', '2025-03-26', '15:00', 7, 'Requested', null, false],
      ['Leo Johnson', 'Amy Johnson', 'amyjohnson@email.com', '555-3008', 'Trumpet', '2025-03-20', '16:00', 8, 'Scheduled', null, false],
      ['Mila Rosenberg', 'Dan Rosenberg', 'drosenberg@email.com', '555-3009', 'Clarinet', '2025-03-19', '14:00', 9, 'Completed', 'Will decide next week', false],
      ['Kai Williams', 'Tom Williams', 'twilliams2@email.com', '555-3010', 'Saxophone', '2025-03-27', '16:00', 10, 'Requested', null, false],
      ['Ruby Anderson', 'Beth Anderson', 'banderson2@email.com', '555-3011', 'Piano', '2025-03-28', '10:00', 11, 'Requested', null, false],
      ['Finn Mitchell', 'Claire Mitchell', 'cmitchell@email.com', '555-3012', 'Violin', '2025-03-22', '11:00', 12, 'Scheduled', null, false],
      ['Isla Brooks', 'Peter Brooks', 'pbrooks@email.com', '555-3013', 'Harp', '2025-03-24', '17:00', 13, 'Requested', null, false],
      ['Jake Rivera', 'Maria Rivera', 'mrivera@email.com', '555-3014', 'Bass Guitar', '2025-03-21', '17:00', 14, 'Scheduled', null, false],
      ['Chloe Park', 'Soo Park', 'soopark@email.com', '555-3015', 'Oboe', '2025-03-25', '17:00', 15, 'Requested', null, false],
    ];
    for (const tl of trialLessons) {
      await client.query(
        `INSERT INTO trial_lessons (student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        tl
      );
    }

    // 24. Waiting List
    console.log('Seeding waiting list...');
    const waitingList = [
      ['Emma Rodriguez', 'Ana Rodriguez', 'arodriguez@email.com', '555-4001', 'Piano', 'Monday', 'After 3pm', 'Maria Rossi', 1, 'Waiting'],
      ['Jack Lee', 'Susan Lee', 'slee@email.com', '555-4002', 'Violin', 'Wednesday', 'Morning', 'David Chen', 2, 'Waiting'],
      ['Grace Taylor', 'Bob Taylor', 'btaylor@email.com', '555-4003', 'Flute', 'Tuesday', 'After school', 'Sarah O\'Brien', 3, 'Waiting'],
      ['Luca Moretti', 'Elena Moretti', 'emoretti@email.com', '555-4004', 'Guitar', 'Thursday', 'Evening', 'Carlos Mendez', 4, 'Waiting'],
      ['Hannah Kim', 'David Kim', 'dkim@email.com', '555-4005', 'Cello', 'Saturday', 'Morning', 'Emily Watson', 5, 'Waiting'],
      ['Samuel Brown', 'Linda Brown', 'lbrown@email.com', '555-4006', 'Drums', 'Friday', 'After 4pm', 'Marcus Johnson', 3, 'Waiting'],
      ['Ella White', 'Tom White', 'twhite@email.com', '555-4007', 'Voice', 'Monday', 'After school', 'Lisa Park', 2, 'Waiting'],
      ['Ryan Chen', 'Mei Chen', 'meichen@email.com', '555-4008', 'Trumpet', 'Wednesday', 'Evening', 'Robert Taylor', 5, 'Waiting'],
      ['Ava Suzuki', 'Ken Suzuki', 'ksuzuki@email.com', '555-4009', 'Piano', 'Saturday', 'Afternoon', 'Jennifer Adams', 1, 'Waiting'],
      ['Ethan Moore', 'Sandra Moore', 'smoore@email.com', '555-4010', 'Saxophone', 'Tuesday', 'After 5pm', 'Michael Lee', 4, 'Waiting'],
      ['Lily Johnson', 'Mike Johnson', 'mjohnson@email.com', '555-4011', 'Clarinet', 'Thursday', 'After school', 'Anna Schmidt', 3, 'Waiting'],
      ['Daniel Park', 'Yuna Park', 'ypark@email.com', '555-4012', 'Violin', 'Saturday', 'Morning', 'Thomas Wright', 2, 'Waiting'],
      ['Sofia Hernandez', 'Jose Hernandez', 'jhernandez@email.com', '555-4013', 'Harp', 'Monday', 'Afternoon', 'Rachel Green', 5, 'Waiting'],
      ['Owen Davis', 'Kate Davis', 'kdavis@email.com', '555-4014', 'Bass Guitar', 'Friday', 'Evening', 'Kevin Brown', 4, 'Waiting'],
      ['Zoey Wilson', 'Brian Wilson', 'bwilson@email.com', '555-4015', 'Oboe', 'Wednesday', 'After school', 'Sophie Turner', 3, 'Waiting'],
    ];
    for (const wl of waitingList) {
      await client.query(
        `INSERT INTO waiting_list (student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        wl
      );
    }

    // 25. Report Cards
    console.log('Seeding report cards...');
    const reportCards = [
      [1, 1, 'Fall', 2024, 'Piano', 'B+', 'A-', 'B', 'B', 'A', 'B+', 'Emma shows strong musicality and dedication.', 'Work on sight-reading and scales'],
      [2, 2, 'Fall', 2024, 'Violin', 'A', 'A', 'A-', 'A-', 'A', 'A', 'Liam is an exceptional student with great technique.', 'Prepare for Grade 8 exam'],
      [3, 3, 'Fall', 2024, 'Flute', 'B-', 'B', 'C+', 'C', 'B+', 'B', 'Sophia is making good progress for a beginner.', 'Focus on tone production'],
      [4, 4, 'Fall', 2024, 'Guitar', 'B', 'B+', 'B-', 'B-', 'B', 'B', 'Noah enjoys playing and is progressing well.', 'Learn more fingerpicking patterns'],
      [5, 5, 'Fall', 2024, 'Cello', 'A', 'A+', 'A', 'A', 'A', 'A', 'Olivia is our top cello student.', 'Start working on concerto repertoire'],
      [6, 6, 'Fall', 2024, 'Drums', 'B-', 'B', 'C', 'N/A', 'B-', 'B-', 'Ethan has lots of energy and enthusiasm.', 'Work on dynamic control'],
      [7, 7, 'Fall', 2024, 'Voice', 'B+', 'A', 'B+', 'B', 'A-', 'B+', 'Ava has a beautiful voice and stage presence.', 'Expand repertoire range'],
      [8, 8, 'Fall', 2024, 'Trumpet', 'B+', 'B', 'B', 'B+', 'B', 'B+', 'Mason is developing a strong jazz foundation.', 'Work on upper register'],
      [9, 9, 'Fall', 2024, 'Clarinet', 'B-', 'B-', 'C+', 'C+', 'B', 'B-', 'Isabella is steady in her practice.', 'Focus on crossing the break smoothly'],
      [10, 10, 'Fall', 2024, 'Saxophone', 'B+', 'A-', 'B', 'B+', 'A-', 'B+', 'James has a natural feel for jazz.', 'Learn more jazz standards'],
      [11, 1, 'Fall', 2024, 'Piano', 'C+', 'B', 'C', 'C', 'B', 'C+', 'Mia is a young beginner showing promise.', 'Continue building finger strength'],
      [12, 2, 'Fall', 2024, 'Violin', 'A+', 'A+', 'A', 'A+', 'A+', 'A+', 'Alexander is a prodigious talent.', 'Prepare for national competition'],
      [13, 13, 'Fall', 2024, 'Harp', 'B', 'B+', 'B', 'B-', 'B+', 'B', 'Charlotte is making lovely progress on harp.', 'Work on pedal changes'],
      [14, 14, 'Fall', 2024, 'Bass Guitar', 'B', 'B', 'B-', 'B-', 'B', 'B', 'Benjamin has a good groove sense.', 'Learn walking bass lines'],
      [15, 15, 'Fall', 2024, 'Oboe', 'C+', 'B-', 'C', 'C', 'B-', 'C+', 'Amelia is tackling a challenging instrument bravely.', 'Reed preparation and long tones'],
    ];
    for (const rc of reportCards) {
      await client.query(
        `INSERT INTO report_cards (student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        rc
      );
    }

    // 26. Certificates
    console.log('Seeding certificates...');
    const certificates = [
      [1, 'Exam', 'ABRSM Grade 4 Piano', '2025-01-20', 'Passed with Merit', 'Grade 4', 'ABRSM'],
      [2, 'Exam', 'ABRSM Grade 7 Violin', '2025-01-25', 'Passed with Distinction', 'Grade 7', 'ABRSM'],
      [4, 'Exam', 'RCM Level 5 Guitar', '2024-12-15', 'Passed', 'Level 5', 'RCM'],
      [5, 'Exam', 'ABRSM Grade 8 Cello', '2024-11-25', 'Passed with Distinction', 'Grade 8', 'ABRSM'],
      [7, 'Exam', 'ABRSM Grade 5 Voice', '2025-02-15', 'Passed with Merit', 'Grade 5', 'ABRSM'],
      [8, 'Exam', 'ABRSM Grade 6 Trumpet', '2024-12-20', 'Passed', 'Grade 6', 'ABRSM'],
      [10, 'Exam', 'RCM Level 5 Saxophone', '2025-01-30', 'Passed with Honors', 'Level 5', 'RCM'],
      [12, 'Exam', 'ABRSM Grade 8 Violin', '2024-10-20', 'Passed with Distinction', 'Grade 8', 'ABRSM'],
      [13, 'Exam', 'Trinity Grade 4 Harp', '2025-02-05', 'Passed', 'Grade 4', 'Trinity'],
      [14, 'Exam', 'RCM Level 4 Bass Guitar', '2024-12-25', 'Passed', 'Level 4', 'RCM'],
      [1, 'Achievement', 'Winter Showcase Outstanding Performance', '2024-12-15', 'Outstanding performance at winter showcase', null, 'Music School'],
      [2, 'Achievement', 'Concertmaster Award', '2024-12-15', 'Excellence as orchestra concertmaster', null, 'Music School'],
      [5, 'Achievement', 'Most Improved Student', '2024-12-15', 'Remarkable improvement throughout the semester', null, 'Music School'],
      [12, 'Achievement', 'Academic Excellence', '2024-12-15', 'Highest grades across all exams', null, 'Music School'],
      [7, 'Participation', 'Winter Showcase Participant', '2024-12-15', 'Participated in the winter showcase recital', null, 'Music School'],
    ];
    for (const c of certificates) {
      await client.query(
        `INSERT INTO certificates (student_id, type, title, date_issued, description, level, issued_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        c
      );
    }

    // 27. Merchandise
    console.log('Seeding merchandise...');
    const merchandiseItems = [
      ['School T-Shirt (S)', 'Apparel', 'Navy blue t-shirt with school logo', 15.00, 8.00, 25, 'MERCH-001', 'In Stock'],
      ['School T-Shirt (M)', 'Apparel', 'Navy blue t-shirt with school logo', 15.00, 8.00, 30, 'MERCH-002', 'In Stock'],
      ['School T-Shirt (L)', 'Apparel', 'Navy blue t-shirt with school logo', 15.00, 8.00, 20, 'MERCH-003', 'In Stock'],
      ['Music Bag', 'Accessories', 'Canvas tote bag with treble clef design', 12.00, 5.00, 40, 'MERCH-004', 'In Stock'],
      ['Metronome - Digital', 'Equipment', 'Digital clip-on metronome', 25.00, 12.00, 15, 'MERCH-005', 'In Stock'],
      ['Tuner - Chromatic', 'Equipment', 'Chromatic clip-on tuner', 20.00, 10.00, 20, 'MERCH-006', 'In Stock'],
      ['Music Stand - Folding', 'Equipment', 'Portable folding music stand', 35.00, 18.00, 10, 'MERCH-007', 'In Stock'],
      ['Practice Journal', 'Stationery', 'Weekly practice log journal', 8.00, 3.00, 50, 'MERCH-008', 'In Stock'],
      ['Manuscript Paper Pad', 'Stationery', '50-page manuscript paper pad', 6.00, 2.00, 45, 'MERCH-009', 'In Stock'],
      ['Pencil Set - Music', 'Stationery', 'Set of 6 pencils with music quotes', 5.00, 2.00, 60, 'MERCH-010', 'In Stock'],
      ['Violin Rosin', 'Accessories', 'Premium violin rosin', 12.00, 6.00, 25, 'MERCH-011', 'In Stock'],
      ['Guitar Picks (12-pack)', 'Accessories', 'Assorted gauge guitar picks', 8.00, 3.00, 40, 'MERCH-012', 'In Stock'],
      ['Clarinet Reeds (Box of 10)', 'Accessories', 'Vandoren #2.5 clarinet reeds', 25.00, 15.00, 20, 'MERCH-013', 'In Stock'],
      ['School Hoodie', 'Apparel', 'Navy blue hoodie with school logo', 35.00, 18.00, 15, 'MERCH-014', 'In Stock'],
      ['Water Bottle - Music Note', 'Accessories', 'Stainless steel water bottle', 18.00, 8.00, 30, 'MERCH-015', 'In Stock'],
      ['Drum Sticks (Pair)', 'Accessories', 'Vic Firth 5A drum sticks', 12.00, 6.00, 20, 'MERCH-016', 'In Stock'],
    ];
    for (const m of merchandiseItems) {
      await client.query(
        `INSERT INTO merchandise (name, category, description, price, cost, stock, sku, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        m
      );
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().then(() => {
  console.log('Done.');
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
