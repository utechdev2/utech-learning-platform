export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  content?: string;
  points: string[];
  quiz: { question: string; options: string[]; answer: number };
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    slug: "python-programming", title: "Python Programming",
    description: "A practical foundation in Python programming, from variables and conditions to functions, collections and small projects.", level: "Beginner", duration: "8 hours",
    lessons: [
      {slug:"what-is-python",title:"What is Python?",summary:"Python is a readable, general-purpose programming language used for web development, automation, data and AI.",points:["Python uses indentation to define code blocks.","Programs are executed by the Python interpreter.","Readable syntax makes Python approachable for beginners."],quiz:{question:"Which feature is central to Python block structure?",options:["Indentation","HTML tags","Semicolons only","SQL tables"],answer:0}},
      {slug:"variables-and-data-types",title:"Variables and data types",summary:"Variables give names to values, while data types describe what those values represent.",points:["Common types include int, float, str and bool.","Use type() to inspect a value's type.","Python variables do not require an explicit type declaration."],quiz:{question:"Which type stores whole numbers?",options:["str","int","bool","list"],answer:1}},
      {slug:"input-and-output",title:"Input and output",summary:"Programs become interactive when they receive input and communicate results through output.",points:["input() returns text by default.","Use int() or float() when numeric input is required.","print() displays values and messages."],quiz:{question:"What type does input() return by default?",options:["int","float","str","bool"],answer:2}},
      {slug:"conditions",title:"Conditions",summary:"Conditional logic lets a program choose different actions based on whether expressions are true or false.",points:["Use if for a condition and else for the alternative.","elif handles additional conditions.","Comparison operators produce Boolean results."],quiz:{question:"Which keyword handles an additional condition?",options:["loop","elif","case","check"],answer:1}},
      {slug:"loops",title:"Loops",summary:"Loops repeat instructions so programs can process collections or repeat work efficiently.",points:["for loops are useful for iterating over sequences.","while loops continue while a condition remains true.","A loop should have a clear stopping condition."],quiz:{question:"Which loop is commonly used to iterate through a list?",options:["for","if","try","def"],answer:0}},
      {slug:"functions",title:"Functions",summary:"Functions package reusable logic into named blocks that can accept inputs and return results.",points:["Define functions with def.","Parameters allow functions to receive values.","return sends a result back to the caller."],quiz:{question:"Which keyword defines a Python function?",options:["func","define","def","return"],answer:2}},
    ]
  },
  {
    slug: "computer-networking", title: "Computer Networking",
    description: "Understand how devices communicate and how modern networks are designed, configured and secured.", level: "Beginner → Intermediate", duration: "10 hours",
    lessons: [
      {slug:"what-is-a-network",title:"What is a network?",summary:"A computer network connects devices so they can exchange data and share resources.",points:["Endpoints communicate over wired or wireless links.","Protocols define how communication works.","Networks can share services such as files, printers and internet access."],quiz:{question:"What is the main purpose of a network?",options:["Connect devices for communication","Only store passwords","Replace operating systems","Create documents"],answer:0}},
      {slug:"network-types",title:"Network types",summary:"Networks are commonly described by their scope, such as LAN, WAN and personal networks.",points:["LANs cover a limited local area.","WANs connect networks across larger geographic areas.","Network scope affects design, technologies and management."],quiz:{question:"Which network normally covers a local building or campus area?",options:["LAN","WAN","PAN only","Internet backbone"],answer:0}},
      {slug:"network-topologies",title:"Network topologies",summary:"Topology describes how network devices and links are arranged physically or logically.",points:["Star networks connect devices through a central point.","Bus topologies use a shared backbone.","Topology choices affect resilience, cost and troubleshooting."],quiz:{question:"Which topology commonly uses a central switch?",options:["Star","Bus","Ring only","Point-to-point only"],answer:0}},
      {slug:"osi-model",title:"OSI model",summary:"The OSI model provides seven conceptual layers for understanding network communication.",points:["Layers range from Physical to Application.","Each layer has a defined communication role.","The model helps isolate and troubleshoot network problems."],quiz:{question:"How many layers are in the OSI model?",options:["4","5","7","9"],answer:2}},
      {slug:"ip-addressing",title:"IP addressing",summary:"IP addresses identify network interfaces so packets can be delivered between networks.",points:["IPv4 uses 32-bit addresses.","Subnets divide address space into logical networks.","A default gateway provides a path to other networks."],quiz:{question:"What does an IP address identify?",options:["A network interface/address endpoint","A file type","A programming language","A monitor"],answer:0}},
      {slug:"routing-basics",title:"Routing basics",summary:"Routing determines where packets should go to reach a destination network.",points:["Routers use routing tables to make forwarding decisions.","Routes can be connected, static or learned dynamically.","The longest-prefix match is important in IPv4 routing decisions."],quiz:{question:"What device normally forwards packets between networks?",options:["Switch only","Router","Keyboard","Printer"],answer:1}},
    ]
  },
  {
    slug: "cybersecurity", title: "Cybersecurity Foundations",
    description: "Learn the principles, terminology and defensive habits behind practical cybersecurity.", level: "Beginner", duration: "7 hours",
    lessons: [
      {slug:"security-fundamentals",title:"Security fundamentals",summary:"Cybersecurity protects information systems through confidentiality, integrity and availability.",points:["Confidentiality limits information exposure.","Integrity protects data from unauthorized change.","Availability keeps systems and services usable."],quiz:{question:"Which principle focuses on preventing unauthorized disclosure?",options:["Availability","Confidentiality","Routing","Compression"],answer:1}},
      {slug:"threats-and-vulnerabilities",title:"Threats and vulnerabilities",summary:"A threat can exploit a weakness, while a vulnerability is a condition that can be exploited.",points:["Threats represent potential sources of harm.","Vulnerabilities are weaknesses in systems or processes.","Risk considers likelihood and potential impact."],quiz:{question:"What is a vulnerability?",options:["A system weakness","A backup file","A user interface","A network cable"],answer:0}},
      {slug:"authentication",title:"Authentication",summary:"Authentication verifies who or what is requesting access to a system.",points:["Passwords are one authentication factor.","Multi-factor authentication combines different factor types.","Authentication comes before authorization decisions."],quiz:{question:"What does authentication verify?",options:["Identity","File size","Screen resolution","Network speed"],answer:0}},
      {slug:"access-control",title:"Access control",summary:"Access control determines what authenticated users or systems are allowed to do.",points:["Authorization defines permitted actions.","Least privilege limits access to what is necessary.","Roles can simplify permission management."],quiz:{question:"What principle limits access to only what is needed?",options:["Least privilege","Open access","Maximum trust","Broadcast"],answer:0}},
      {slug:"network-security",title:"Network security",summary:"Network security uses controls and monitoring to reduce unauthorized access and malicious traffic.",points:["Firewalls enforce traffic rules.","Network segmentation can limit lateral movement.","Monitoring helps identify suspicious activity."],quiz:{question:"What is a firewall primarily used for?",options:["Filtering network traffic","Writing code","Editing images","Managing printers"],answer:0}},
      {slug:"defensive-thinking",title:"Defensive thinking",summary:"Defensive security starts by identifying assets, threats, weaknesses and practical controls.",points:["Think in terms of attack paths and exposed assets.","Layered controls reduce dependence on one defense.","Security is an ongoing process, not a one-time setup."],quiz:{question:"Why use layered security controls?",options:["To create multiple defensive barriers","To remove all monitoring","To avoid updates","To disable backups"],answer:0}},
    ]
  },
  {
    slug: "linux-essentials", title: "Linux Essentials",
    description: "Build confidence with Linux through the terminal, filesystem, permissions, processes and essential administration tasks.", level: "Beginner", duration: "6 hours",
    lessons: [
      {slug:"the-linux-terminal",title:"The Linux terminal",summary:"The terminal provides a command-line interface for controlling Linux systems efficiently.",points:["Shells interpret commands entered by the user.","pwd shows the current working directory.","Commands can be combined with options and arguments."],quiz:{question:"Which command shows the current directory?",options:["pwd","cd","rm","mkdir"],answer:0}},
      {slug:"files-and-directories",title:"Files and directories",summary:"Linux organizes files in a hierarchical filesystem that can be navigated from the terminal.",points:["ls lists directory contents.","cd changes the current directory.","mkdir creates a directory."],quiz:{question:"Which command creates a directory?",options:["touch","mkdir","pwd","cat"],answer:1}},
      {slug:"permissions",title:"Permissions",summary:"Linux permissions control who can read, write or execute files and directories.",points:["Permissions are grouped for owner, group and others.","r, w and x represent read, write and execute.","chmod changes permission modes."],quiz:{question:"What does x commonly represent in Linux permissions?",options:["Execute","Export","Encrypt","Exit"],answer:0}},
      {slug:"processes",title:"Processes",summary:"A process is a running program instance that consumes system resources.",points:["ps can display running processes.","Processes have identifiers called PIDs.","Signals can request actions such as termination."],quiz:{question:"What does PID stand for?",options:["Process Identifier","Package Install Directory","Private Internet Domain","Program Input Device"],answer:0}},
      {slug:"packages",title:"Packages",summary:"Package managers install, update and remove software while handling dependencies.",points:["Package managers keep software installation organized.","Updates can include security fixes.","Repositories provide packages for supported distributions."],quiz:{question:"What is a package manager used for?",options:["Managing software packages","Drawing networks","Editing photos","Writing HTML only"],answer:0}},
      {slug:"shell-productivity",title:"Shell productivity",summary:"Shell tools become powerful when commands are combined with pipes, redirection and useful shortcuts.",points:["Pipes send one command's output to another command.","Redirection can write output to files.","History and tab completion speed up repetitive work."],quiz:{question:"What symbol commonly pipes output into another command?",options:["|","#","@","%"],answer:0}},
    ]
  }
];

export function getCourse(slug: string) { return courses.find(course => course.slug === slug); }
export function getLesson(courseSlug: string, lessonSlug: string) { return getCourse(courseSlug)?.lessons.find(lesson => lesson.slug === lessonSlug); }
