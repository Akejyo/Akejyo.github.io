export const site = {
  name: "Akejyo",
  title: "Northline",
  heroImage: "/assets/arctic-frontier.png",
  personaImage: "/assets/persona-1600.jpg",
  personaAlt:
    "A silver-haired woman seated at a candlelit table, her hands framing a crimson Cresson flower against a dark northern forest.",
  description:
    "Research, notes, projects, and fragments. A personal journal about attention, memory, and the northern landscape.",
};

export const expeditions = [
  {
    slug: "triangle-counting-on-multiple-gpus",
    number: "05",
    title: "Triangle counting on multiple GPUs",
    status: "ACTIVE",
    field: "Research / HPC",
    record: "2026-09-10",
    description:
      "A research project on triangle counting on multiple GPUs, with a focus on optimizing performance and scalability.",
    question:
      "How can we efficiently count triangles in large graphs using multiple GPUs? What are the best practices for optimizing performance and scalability in this context?",
    method: "Literature review, algorithm design...",
    output: "...",
    posts: ["2026-09-24-t-count"],
  },
  {
    slug: "arknights-particle-simulation",
    number: "05",
    title: "Image as particle, transition as particle",
    status: "COMPLETED",
    field: "Programming / frontend",
    record: "2024-05-11",
    description:
      "A project to replicate the particle simulation on the Arknights website.",
    question:
      "How to replicate the particle simulation on Arknights website? Including show image as particle and transition as particle.",
    method:
      "Repulsive force between particles and particles/particle and cursor, attractive force for reset position.",
    output:
      "A functional implementation of the particle simulation on the Arknights website.",
    posts: ["2024-05-11-arknights-particles-animation"],
  },
  {
    slug: "hynoo-online-chatroom",
    number: "04",
    title: "HynnO, chat at any time directly",
    status: "DORMANT",
    field: "Programming / networking",
    record: "2024-05-05",
    description:
      "A service that allows users to open a chatroom by directly accessing a URL made by the user themselves.",
    question:
      "Can we open a chatroom by accessing a URL like chatroom/>chatroom_name? Everyone can join this chatroom directly as long as someone has accessed this URL.",
    method:
      "Based on WebSocket, using Rust as backend language and React as frontend framework.",
    output:
      "HynnO, a service that allows users to open a chatroom by directly accessing a URL made by the user themselves.",
    posts: ["2024-05-05-hynoo"],
  },
  {
    slug: "optimizing-Eratosthenes-Sieve-with-MPI",
    number: "03",
    title: "MPI optimization of Eratosthenes Sieve",
    status: "COMPLETED",
    field: "Programming / parallel computing",
    record: "2024-03-31",
    description:
      "Using MPI to optimize the Eratosthenes Sieve algorithm. No changes to the algorithm itself, but tons of tricks of parallelization.",
    question:
      "Optimize the Eratosthenes Sieve algorithm using MPI. Without changing the algorithm itself, how can we make it faster using parallelization?",
    method:
      "Remove even numbers/Remove broadcast/Optimize cache/memset/loop unrolling/__builtin_popcount/register&inline assembly",
    output: "Reached 27.6x speedup on 16 cores",
    posts: ["2024-03-31-mpis"],
  },
  {
    slug: "udp-hole-punching",
    number: "02",
    title: "UDP hole punching",
    status: "COMPLETED",
    field: "Programming / networking",
    record: "2023-05-07",
    description: "An experiment in learning about UDP hole punching.",
    question:
      "Understand the process of UDP hole punching and how to implement it.",
    method:
      "Using C++ as programming language, testing with terminal on VM/Linux.",
    output: "A report about UDP hole punching and its implementation.",
    posts: ["2023-05-07-udp"],
  },
  {
    slug: "first-attempt-at-pixel-game",
    number: "01",
    title: "Little vampire, first attempt at Unity pixel game",
    status: "LOST",
    field: "Development / game design",
    record: "2022-07-01",
    description:
      "A small, experimental pixel game made in Unity. The player controls a vampire girl who need to solve a few puzzles to escape a strange place.",
    question: "Make a small pixel game with some puzzles.",
    method:
      "Aseprite as drawing tool, Unity as game engine. Some puzzles get the idea from ACM algorithm problems.",
    output: "A small pixel game with some puzzles.",
    posts: ["2022-07-01-littlevampire"],
  },
];
