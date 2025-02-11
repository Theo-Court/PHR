import { serve } from "https://deno.land/std@0.218.2/http/server.ts";
import { join, extname } from "https://deno.land/std/path/mod.ts";

async function loadConfig() {
  const configFile = await Deno.readTextFile('./json/config.json');
  const config = JSON.parse(configFile);
  return config;
}
const config = await loadConfig();
const PORT = config.port;

const publicPath = join(Deno.cwd(), "../public");
const cssPath = join(publicPath, "css"); // CSS path defined here
const jsonPath = join(Deno.cwd(), "json"); // Define jsonPath here
const jsPath = join(publicPath, "js"); // JavaScript files path
const imagePath = join(Deno.cwd(), "img");

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let filePath = "";
  let jsonFilePath = ""; // Define jsonFilePath here

  if (url.pathname.startsWith("/json/niveau")) {
    const level = url.pathname.split("/").pop();
    jsonFilePath = join(jsonPath, `${level}.json`); 
    try {
      const fileContents = await Deno.readTextFile(jsonFilePath);
      return new Response(fileContents, { headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error(error);
      return new Response('Not Found', { status: 404 });
    }
  }

  if (url.pathname.startsWith("/img/")) {
    const imageName = decodeURIComponent(url.pathname.substring(5)); // Decode URL-encoded characters
    filePath = join(imagePath, imageName); // Adjust the path
    const contentType = getContentType(filePath);

    try {
      const fileContents = await Deno.readFile(filePath);
      return new Response(fileContents, { headers: { "Content-Type": contentType } });
    } catch (error) {
      console.error(`Failed to read ${filePath}:`, error);
      return new Response('Not Found', { status: 404 });
    }
  }

  if (url.pathname === '/') {
    filePath = join(publicPath, "html/accueil.html");
  } else if (url.pathname.startsWith('/css/')) { // Handling CSS files
    filePath = join(cssPath, url.pathname.substring(5)); // Adjust the path
  } else if (url.pathname.startsWith('/js/')) { // Handle JavaScript files
    filePath = join(jsPath, url.pathname.substring(4)); // Adjust the path
  } else {
    filePath = join(publicPath, "html" + url.pathname);
  }

  const contentType = getContentType(filePath);

  try {
    const fileContents = await Deno.readFile(filePath);
    return new Response(fileContents, { headers: { "Content-Type": contentType } });
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return new Response('Not Found', { status: 404 });
  }
};

function getContentType(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'text/plain';
  }
}


async function startServer() {
  const config = await loadConfig();
  const PORT = config.port;
  
  serve(handler, { port: PORT });
  console.log(`Server running on http://localhost:${PORT}`);
}

startServer();