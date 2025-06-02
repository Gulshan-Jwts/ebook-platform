export const user = {
    userId: 'USR123456',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    username: 'john_doe',
    purchasedList: [ '57672764','57672762',],
    cartList: ['57672763', '57672766', '57672765'],
    createdAt: '2025-05-18T06:30:00Z',
    firstName: 'John',
    lastName: 'Doe',
    isAdmin: true,
};

export const books = {
    '48-laws-of-power': {
        id: '57672762',
        title: 'The 48 Laws of Power',
        author: 'Robert Greene',
        uploadDate: '25-3-2025',
        pdf: '/documents/pdf1.pdf',
        image: '../../images/Bookcover.jpg',
        description:
            '"The 48 Laws of Power" by Robert Greene is a timeless guide to understanding the dynamics of power and influence. Drawing from historical examples and philosophical insights, this book offers 48 laws to navigate complex social and professional landscapes. Whether you\'re aiming to rise in your career, master strategic thinking, or simply understand human behavior, this book provides profound lessons that are both practical and thought-provoking. Perfect for ambitious minds looking to gain an edge in life.',
        reviews: [
            {
                name: 'Aditya Sharma',
                rating: 5,
                text: 'The 48 Laws of Power is a game-changer! The insights are profound and applicable in every sphere of life. A must-have for ambitious minds.',
            },
            {
                name: 'Priya Patel',
                rating: 4,
                text: 'An engaging read with deep psychological insights. The digital format is perfect for quick reference and highlighting key points.',
            },
        ],
        oldPrice: '₹179',
        currentPrice: '₹119',
        sells: '47',
    },
    'digital-mind-trap': {
        id: '57672763',
        title: 'Digital Mind Trap',
        author: 'Naveen Kewat',
        uploadDate: '25-3-2025',
        pdf: '/documents/pdf2.pdf',
        image: '/images/cover1.jpg',
        description:
            'A deep dive into the psychological effects of the digital age, "Digital Mind Trap" by Naveen Kewat explores how technology shapes our thoughts, behaviors, and relationships. This book offers practical strategies to break free from digital overload and reclaim control over your mind.',
        reviews: [
            {
                name: 'Rahul Verma',
                rating: 4,
                text: 'Incredibly insightful! A must-read for anyone feeling overwhelmed by the digital world.',
            },
        ],
        oldPrice: '₹249',
        currentPrice: '₹149',
        sells: '47',
    },
    'atomic-habits': {
        id: '57672764',
        title: 'Atomic Habits',
        author: 'James Clear',
        uploadDate: '10-4-2025',
        pdf: '/documents/pdf3.pdf',
        image: '/images/cover2.jpg',
        description:
            '"Atomic Habits" by James Clear is a transformative guide to building good habits and breaking bad ones. With practical strategies and compelling insights, this book shows how small changes can lead to remarkable results. Perfect for anyone looking to improve their productivity, health, or personal growth.',
        reviews: [
            {
                name: 'Sneha Gupta',
                rating: 5,
                text: 'This book changed the way I approach my daily routines. The concepts are simple yet powerful!',
            },
            {
                name: 'Vikram Singh',
                rating: 4,
                text: 'A well-written and practical guide to habit formation. Highly recommend it.',
            },
        ],
        oldPrice: '₹199',
        currentPrice: '₹139',
        sells: '52',
    },
    'thinking-fast-and-slow': {
        id: '57672765',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        uploadDate: '15-4-2025',
        pdf: '/documents/pdf4.pdf',
        image: '/images/cover3.jpg',
        description:
            '"Thinking, Fast and Slow" by Daniel Kahneman explores the two systems that drive human thought: the fast, intuitive system and the slow, deliberate one. This groundbreaking book reveals how our minds make decisions and offers insights into avoiding cognitive biases. A must-read for those interested in psychology and decision-making.',
        reviews: [
            {
                name: 'Anjali Mehta',
                rating: 5,
                text: 'Mind-blowing insights into how we think. Kahneman’s work is a masterpiece.',
            },
            {
                name: 'Rohan Desai',
                rating: 4,
                text: 'A bit dense but incredibly rewarding. Great for understanding human behavior.',
            },
        ],
        oldPrice: '₹229',
        currentPrice: '₹169',
        sells: '38',
    },
    sapiens: {
        id: '57672766',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        uploadDate: '20-4-2025',
        pdf: '/documents/pdf5.pdf',
        image: '/images/cover4.jpg',
        description:
            '"Sapiens" by Yuval Noah Harari takes readers on a journey through the history of humankind, from the Stone Age to the modern era. This thought-provoking book examines how biology, culture, and technology have shaped our species. Ideal for readers curious about history, science, and the future.',
        reviews: [
            {
                name: 'Kavya Reddy',
                rating: 5,
                text: 'An incredible book that connects the dots of human history. Absolutely fascinating!',
            },
        ],
        oldPrice: '₹259',
        currentPrice: '₹189',
        sells: '45',
    },
};
