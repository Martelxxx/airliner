// src/Components/FlightPlanner/index.jsx
import React, { useContext, useState } from 'react';
import LegDetails from '../../MainContent/FlightPlanner/LegDetails/LegDetails';
import { FlightPlannerContext } from './FlightPlannerContext';
import { calculateDistance } from '../../Services/utils';
import airportData from 'airport-data';
import moment from 'moment';

const aircraftSpecs = {
  CRJ700: { paxCapacity: 70, speed: 447, range: 1430 },
  'B737-8': { paxCapacity: 189, speed: 460, range: 3500 },
  'B787-8': { paxCapacity: 242, speed: 488, range: 7300 },
  'A350-900': { paxCapacity: 325, speed: 488, range: 8100 },
};

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

const getRegionFromICAO = (icao) => {
  if (!icao || typeof icao !== 'string') return 'North America';
  const prefix = icao[0].toUpperCase();
  switch (prefix) {
    case 'K': case 'C': case 'M': return 'North America';
    case 'E': case 'L': case 'B': case 'U': return 'Europe';
    case 'R': case 'Z': case 'V': case 'P': return 'Asia';
    case 'O': return 'Middle East';
    case 'F': case 'D': case 'H': return 'Africa';
    case 'S': return 'South America';
    case 'N': case 'Y': return 'Oceania';
    default: return 'North America';
  }
};

const generateName = (region) => {
  const firstNames = namesByRegion[region]?.firstNames;
  const lastNames = namesByRegion[region]?.lastNames;
  const celebrityNames = namesByRegion[region]?.celebrityNames;
  if (!firstNames || !lastNames || !celebrityNames) {
    throw new Error(`Region ${region} not found in namesByRegion`);
  }
  if (Math.random() < 0.1) {
    return celebrityNames[Math.floor(Math.random() * celebrityNames.length)];
  }
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

const formatTime = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const FlightPlanner = () => {
  const { legs, setLegs } = useContext(FlightPlannerContext);
  const [startingICAO, setStartingICAO] = useState('');

  const generateSchedule = () => {
    let currentOrigin = startingICAO;
    let currentDepartureTime = moment('2025-02-24T06:00');
    const newLegs = [];
    const maxLegs = 5;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    while (newLegs.length < maxLegs && attempts < maxAttempts) {
      const destination = airportData
        .filter(airport => airport.icao !== currentOrigin)
        .map(airport => airport.icao)
        .sort(() => Math.random() - 0.5)[0];

      const originAirport = airportData.find(a => a.icao === currentOrigin);
      const destAirport = airportData.find(a => a.icao === destination);
      if (!originAirport || !destAirport) {
        attempts++;
        continue;
      }

      const distanceKm = calculateDistance(
        originAirport.latitude, originAirport.longitude,
        destAirport.latitude, destAirport.longitude
      );
      const distanceNm = distanceKm / 1.852;

      const suitableAircraft = Object.entries(aircraftSpecs)
        .filter(([_, specs]) => specs.range >= distanceNm)
        .sort(([a, specA], [b, specB]) => specA.range - specB.range)[0];
      if (!suitableAircraft) {
        attempts++;
        continue;
      }

      const [selectedAircraft, aircraftData] = suitableAircraft;
      const flightTime = distanceNm / aircraftData.speed;
      const blockTime = flightTime + 0.5;
      const arrivalTime = currentDepartureTime.clone().add(flightTime, 'hours');

      const groundTimeMinutes = Math.floor(Math.random() * 21) + 40;
      const nextDepartureTime = arrivalTime.clone().add(groundTimeMinutes, 'minutes');

      if (nextDepartureTime.isAfter(moment('2025-02-24T18:00'))) {
        attempts++;
        continue;
      }

      const paxCount = Math.floor(Math.random() * aircraftData.paxCapacity * 0.9) + 1;
      const legPassengers = generatePassengers(currentOrigin, destination, paxCount);

      const leg = {
        origin: currentOrigin,
        destination,
        aircraft: selectedAircraft,
        departureTime: currentDepartureTime.format('YYYY-MM-DDTHH:mm'),
        arrivalTime: arrivalTime.format('YYYY-MM-DDTHH:mm'),
        flightTime: formatTime(flightTime),
        blockTime: formatTime(blockTime),
        distance: distanceNm,
        passengers: legPassengers,
        paxCount,
      };

      newLegs.push(leg);
      currentOrigin = destination;
      currentDepartureTime = nextDepartureTime;
      attempts = 0; // Reset attempts on success
    }

    if (newLegs.length < maxLegs) {
      console.warn(`Only generated ${newLegs.length} legs due to time constraints`);
    }
    setLegs(newLegs);
  };

  return (
    <div className="flight-planner">
      <h1>Flight Schedule Generator</h1>
      <div>
        <label>
          Starting Airport (ICAO):
          <input type="text" value={startingICAO} onChange={(e) => setStartingICAO(e.target.value)} />
        </label>
        <button onClick={generateSchedule}>Generate Flight Schedule</button>
      </div>
      <div className="flight-planner-content" style={{ display: 'flex', gap: '16px' }}>
        <section className="load-sheet-section" style={{ flex: 1 }}>
          <h2>Load Sheet</h2>
          <LegDetails legs={legs} />
        </section>
      </div>
    </div>
  );
};

export default FlightPlanner;