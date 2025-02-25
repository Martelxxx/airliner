// src/Components/MainContent/PassengerSimulator/PassengerGenerator.jsx
import React, { useEffect } from 'react';

const namesByRegion = {
    'North America': {
      firstNames: [
        'John', 'Jane', 'Michael', 'Emily', 'James', 'Mary', 'Robert', 'Patricia', 'David', 'Linda',
        'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
        'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
        'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua', 'Michelle',
        'Kenneth', 'Dorothy', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Edward', 'Stephanie',
      ],
      lastNames: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
      ],
      celebrityNames: [
        'Tom Hanks', 'Beyoncé Knowles', 'LeBron James', 'Oprah Winfrey', 'Brad Pitt',
        'Taylor Swift', 'Dwayne Johnson', 'Jennifer Lopez', 'Kanye West', 'Angelina Jolie',
      ],
    },
    Europe: {
      firstNames: [
        'Hans', 'Sophie', 'Liam', 'Emma', 'Noah', 'Olivia', 'Lucas', 'Mia', 'Elias', 'Charlotte',
        'Julian', 'Amelia', 'Oscar', 'Isabella', 'Leo', 'Sophia', 'Alexander', 'Ava', 'Benjamin', 'Emily',
        'Henry', 'Ella', 'Samuel', 'Grace', 'Max', 'Chloe', 'Arthur', 'Lily', 'Sebastian', 'Hannah',
        'Finn', 'Zoe', 'Felix', 'Nora', 'Theo', 'Leah', 'Louis', 'Victoria', 'Milo', 'Lucy',
        'Leon', 'Layla', 'Emil', 'Luna', 'Anton', 'Ellie', 'Erik', 'Alice', 'Jonas', 'Matilda',
      ],
      lastNames: [
        'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
        'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
        'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
        'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
        'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Vogel',
      ],
      celebrityNames: [
        'David Beckham', 'Adele Adkins', 'Daniel Craig', 'Emma Watson', 'Cristiano Ronaldo',
        'Ed Sheeran', 'Keira Knightley', 'Lewis Hamilton', 'Penélope Cruz', 'Zlatan Ibrahimović',
      ],
    },
    Asia: {
      firstNames: [
        'Wei', 'Mei', 'Hiro', 'Yuki', 'Li', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang',
        'Hao', 'Jia', 'Min', 'Jun', 'Xin', 'Tao', 'Kai', 'Yan', 'Rin', 'Sora',
        'Aki', 'Ren', 'Lei', 'Han', 'Shu', 'Jin', 'Yu', 'Qing', 'Feng', 'Lan',
        'Bao', 'Chun', 'Dai', 'Hua', 'Kei', 'Mao', 'Nao', 'Ryu', 'Sai', 'Tian',
        'Xue', 'Yao', 'Zhi', 'Bing', 'Dan', 'Gao', 'Hong', 'Jing', 'Ling', 'Ping',
      ],
      lastNames: [
        'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
        'Han', 'Shin', 'Oh', 'Seo', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Ryu', 'Jeon',
        'Hong', 'Ko', 'Moon', 'Yang', 'Son', 'Bae', 'Baek', 'Joo', 'Nam', 'Yoo',
        'Min', 'Ha', 'Chung', 'Koo', 'Jin', 'Hyun', 'Noh', 'Gu', 'Byun', 'Chae',
        'Sung', 'Gil', 'Do', 'Rhee', 'Won', 'Yeo', 'Cheon', 'Sim', 'Heo', 'Kyeong',
      ],
      celebrityNames: [
        'Jackie Chan', 'Priyanka Chopra', 'BTS Jin', 'Deepika Padukone', 'Jet Li',
        'Aishwarya Rai', 'Takeshi Kitano', 'Gong Li', 'Shahrukh Khan', 'Rain Bi',
      ],
    },
    Africa: {
      firstNames: [
        'Kwame', 'Amina', 'Tunde', 'Zara', 'Abdul', 'Fatima', 'Omar', 'Aisha', 'Ali', 'Maryam',
        'Ibrahim', 'Zainab', 'Hassan', 'Khadija', 'Yusuf', 'Sana', 'Ahmed', 'Halima', 'Mohamed', 'Salma',
        'Abdullah', 'Rashida', 'Ismail', 'Jamila', 'Kofi', 'Nana', 'Kwesi', 'Ama', 'Yaw', 'Akosua',
        'Kojo', 'Adwoa', 'Kwabena', 'Afia', 'Kwaku', 'Akua', 'Esi', 'Kweku', 'Efua', 'Kwadwo',
        'Abena', 'Kobina', 'Araba', 'Kwasi', 'Adjoa', 'Yaa', 'Poku', 'Mansa', 'Sefu', 'Zuri',
      ],
      lastNames: [
        'Abebe', 'Adebayo', 'Adeniyi', 'Afolabi', 'Agbaje', 'Agyeman', 'Akinyemi', 'Amadi', 'Asante', 'Ayodele',
        'Azikiwe', 'Banda', 'Chike', 'Chukwu', 'Dlamini', 'Eze', 'Femi', 'Ghana', 'Ifeanyi', 'Juma',
        'Kamau', 'Kanu', 'Kenyatta', 'Kofi', 'Kwame', 'Langa', 'Mabaso', 'Madu', 'Mbeki', 'Mbongeni',
        'Moyo', 'Ndlovu', 'Nkosi', 'Nkrumah', 'Nwosu', 'Obi', 'Okafor', 'Okeke', 'Olu', 'Onyeka',
        'Osman', 'Owusu', 'Said', 'Samba', 'Sankara', 'Sefu', 'Toure', 'Uche', 'Zuma', 'Diallo',
      ],
      celebrityNames: [
        'Nelson Mandela', 'Burna Boy', 'Sadio Mané', 'Trevor Noah', 'Chimamanda Adichie',
        'Akon Thiam', 'Wizkid Balogun', 'Lupita Nyong\'o', 'Idris Elba', 'Djimon Hounsou',
      ],
    },
    'South America': {
      firstNames: [
        'Carlos', 'Maria', 'Juan', 'Ana', 'Luis', 'Carmen', 'Jose', 'Isabel', 'Jorge', 'Luisa',
        'Pedro', 'Sofia', 'Miguel', 'Elena', 'Rafael', 'Teresa', 'Fernando', 'Patricia', 'Ricardo', 'Gabriela',
        'Manuel', 'Julia', 'Francisco', 'Marta', 'Antonio', 'Rosa', 'Alejandro', 'Paula', 'Roberto', 'Adriana',
        'Diego', 'Claudia', 'Raul', 'Beatriz', 'Eduardo', 'Alicia', 'Hector', 'Veronica', 'Pablo', 'Lorena',
        'Andres', 'Monica', 'Javier', 'Silvia', 'Oscar', 'Cristina', 'Mario', 'Daniela', 'Felipe', 'Camila',
      ],
      lastNames: [
        'Gomez', 'Rodriguez', 'Martinez', 'Garcia', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez',
        'Torres', 'Flores', 'Rivera', 'Vargas', 'Castro', 'Ortiz', 'Morales', 'Gutierrez', 'Ramos', 'Reyes',
        'Cruz', 'Mendoza', 'Jimenez', 'Ruiz', 'Alvarez', 'Moreno', 'Diaz', 'Vasquez', 'Santos', 'Dominguez',
        'Suarez', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Pena', 'Rojas', 'Guerrero', 'Salazar', 'Ortega',
        'Delgado', 'Cabrera', 'Molina', 'Soto', 'Campos', 'Vega', 'Silva', 'Nunez', 'Paredes', 'Acosta',
      ],
      celebrityNames: [
        'Lionel Messi', 'Shakira Mebarak', 'Neymar Jr', 'Sofía Vergara', 'Gabriel García',
        'Gisele Bündchen', 'Maluma Londoño', 'Ronaldinho Gaúcho', 'Anitta Larissa', 'James Rodríguez',
      ],
    },
    'Middle East': {
      firstNames: [
        'Ahmed', 'Layla', 'Omar', 'Fatima', 'Youssef', 'Sara', 'Khalid', 'Aisha', 'Hassan', 'Noor',
        'Ali', 'Zainab', 'Mohammed', 'Rania', 'Ibrahim', 'Amal', 'Nasser', 'Huda', 'Tariq', 'Lina',
        'Sami', 'Mona', 'Abdullah', 'Salma', 'Faisal', 'Leila', 'Jamal', 'Dina', 'Rashid', 'Hanan',
        'Saif', 'Nada', 'Hamed', 'Reem', 'Zaid', 'Eman', 'Jaber', 'Sahar', 'Bilal', 'Yasmin',
        'Karim', 'Amina', 'Tamer', 'Noura', 'Adnan', 'Mariam', 'Qasim', 'Farah', 'Rami', 'Laila',
      ],
      lastNames: [
        'Al-Farsi', 'Hassan', 'Khan', 'Al-Sayed', 'Qasim', 'Nasser', 'Jaber', 'Rahim', 'Moussa', 'Ibrahim',
        'Al-Mansoori', 'Saleh', 'Hamad', 'Abdullah', 'Saeed', 'Al-Balushi', 'Omar', 'Mohammed', 'Al-Khalifa', 'Hussein',
        'Al-Najjar', 'Yassin', 'Al-Ahmad', 'Khalil', 'Al-Hashimi', 'Salim', 'Al-Zahrani', 'Fahad', 'Al-Ghamdi', 'Mahmoud',
        'Al-Attiyah', 'Rashed', 'Al-Dosari', 'Hadi', 'Al-Jaber', 'Saad', 'Al-Mutairi', 'Badr', 'Al-Shammari', 'Karim',
        'Al-Rashid', 'Fares', 'Al-Qahtani', 'Sultan', 'Al-Harbi', 'Najib', 'Al-Subaie', 'Taha', 'Al-Otaibi', 'Zaki',
      ],
      celebrityNames: [
        'Mohamed Salah', 'Amr Diab', 'Nancy Ajram', 'Haifa Wehbe', 'Omar Sharif',
        'Yasmin Sabri', 'George Wassouf', 'Assala Nasri', 'Ahmed Zaki', 'Nawal Zoghbi',
      ],
    },
    Oceania: {
      firstNames: [
        'Jack', 'Sophie', 'Oliver', 'Amelia', 'Noah', 'Charlotte', 'James', 'Isla', 'Ethan', 'Mia',
        'William', 'Ava', 'Thomas', 'Grace', 'Lucas', 'Harper', 'Henry', 'Lily', 'Alexander', 'Ruby',
        'Samuel', 'Ella', 'Benjamin', 'Zoe', 'Daniel', 'Chloe', 'Matthew', 'Emily', 'Joshua', 'Scarlett',
        'Jacob', 'Isabella', 'Michael', 'Sofia', 'Liam', 'Evelyn', 'Logan', 'Abigail', 'Ryan', 'Hannah',
        'Luke', 'Madison', 'Mason', 'Aria', 'Nathan', 'Poppy', 'Harry', 'Georgia', 'Lachlan', 'Matilda',
      ],
      lastNames: [
        'Smith', 'Jones', 'Brown', 'Wilson', 'Taylor', 'Davis', 'Clark', 'Harris', 'Lewis', 'Walker',
        'Hall', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson',
        'Mitchell', 'Campbell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Parker', 'Collins', 'Edwards',
        'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Bell', 'Bailey', 'Cooper', 'Richardson',
        'Cox', 'Howard', 'Ward', 'Kelly', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
      ],
      celebrityNames: [
        'Chris Hemsworth', 'Kylie Minogue', 'Hugh Jackman', 'Nicole Kidman', 'Russell Crowe',
        'Margot Robbie', 'Keith Urban', 'Rebel Wilson', 'Cate Blanchett', 'Sam Neill',
      ],
    },
  };

// ICAO prefix to region mapping
const getRegionFromICAO = (icao) => {
  if (!icao || typeof icao !== 'string') return 'North America'; // Default fallback
  const prefix = icao[0].toUpperCase();

  switch (prefix) {
    // North America
    case 'K': return 'North America'; // USA
    case 'C': return 'North America'; // Canada
    case 'M': return 'North America'; // Mexico, Caribbean

    // Europe
    case 'E': return 'Europe'; // Northern Europe (e.g., EGLL - UK)
    case 'L': return 'Europe'; // Southern Europe (e.g., LFPG - France, overlaps Middle East like LLBG - Israel)
    case 'B': return 'Europe'; // Iceland, Greenland
    case 'U': return 'Europe'; // Russia west of Urals (e.g., UUEE - Moscow)

    // Asia
    case 'R': return 'Asia'; // South Korea, Japan, Taiwan (e.g., RJTT - Tokyo)
    case 'Z': return 'Asia'; // China, North Korea (e.g., ZBAA - Beijing)
    case 'V': return 'Asia'; // India, Southeast Asia (e.g., VABB - Mumbai)
    case 'P': return 'Asia'; // Pacific Islands, overlaps Oceania

    // Middle East (subset of O and L)
    case 'O': return 'Middle East'; // Middle East (e.g., OMDB - Dubai)

    // Africa
    case 'F': return 'Africa'; // Southern Africa (e.g., FAOR - Johannesburg)
    case 'D': return 'Africa'; // West Africa (e.g., DNMM - Lagos)
    case 'H': return 'Africa'; // East/North Africa (e.g., HECA - Cairo)
    case 'G': return 'Africa'; // Central Africa (e.g., DGAA - Accra)

    // South America
    case 'S': return 'South America'; // South America (e.g., SBGR - São Paulo)

    // Oceania
    case 'N': return 'Oceania'; // New Zealand (e.g., NZAA - Auckland)
    case 'Y': return 'Oceania'; // Australia (e.g., YSSY - Sydney)

    default: return 'North America'; // Fallback for unmapped prefixes
  }
};

const generateName = (region) => {
    const firstNames = namesByRegion[region]?.firstNames;
    const lastNames = namesByRegion[region]?.lastNames;
    const celebrityNames = namesByRegion[region]?.celebrityNames;
    if (!firstNames || !lastNames || !celebrityNames) {
      throw new Error(`Region ${region} not found in namesByRegion`);
    }
  
    // 10% chance to use a full celebrity name
    if (Math.random() < 0.1) {
      return celebrityNames[Math.floor(Math.random() * celebrityNames.length)];
    }
  
    // Otherwise, mix first and last names
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };
  
  const generatePassengers = (origin, destination, count) => {
    const originRegion = getRegionFromICAO(origin);
    const destinationRegion = getRegionFromICAO(destination);
    if (!originRegion || !destinationRegion) {
      throw new Error(`Region not found for origin ${origin} or destination ${destination}`);
    }
  
    const allRegions = Object.keys(namesByRegion);
    const passengers = Array.from({ length: count }, () => {
      const rand = Math.random();
      let region;
  
      if (rand < 0.77) {
        region = originRegion;
      } else if (rand < 0.95) {
        region = destinationRegion;
      } else {
        region = allRegions[Math.floor(Math.random() * allRegions.length)];
      }
  
      const name = generateName(region);
      const age = Math.floor(Math.random() * 60) + 18;
      return { name, age };
    });
  
    return passengers;
  };
  
  const PassengerGenerator = ({ origin, destination, setPassengers, paxCount }) => {
    useEffect(() => {
      try {
        const passengers = generatePassengers(origin, destination, paxCount);
        setPassengers(passengers);
      } catch (error) {
        console.error(error.message);
        setPassengers([]);
      }
    }, [origin, destination, paxCount, setPassengers]);
  
    return null;
  };
  
  export default PassengerGenerator;