# MCP Image Upload Server

An MCP (Model Context Protocol) server that allows Claude Code to upload images and get public URLs for use in GitHub PRs, documentation, and more.

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/hesscbjr/mcp-image-upload.git
cd mcp-image-upload
npm install
```

### 2. Set up Imgur API

1. Go to https://api.imgur.com/oauth2/addclient
2. Register your application (no account required)
3. Copy the Client ID
4. Create `.env` file:

```bash
echo "IMGUR_CLIENT_ID=your_client_id_here" > .env
```

### 3. Build & Install in Claude Code

```bash
# Build the project
npm run build

# Add to Claude Code (user-scoped)
claude mcp add image-upload -- /path/to/mcp-image-upload/build/index.js

# Or project-scoped
cd /your/project
claude mcp add image-upload -s project -- /path/to/mcp-image-upload/build/index.js
```

### 4. Use in Claude Code

Ask Claude to upload images:
```
"Upload the screenshot at /path/to/screenshot.png"
```

Claude will use the `upload_image` tool and return a URL like:
```
https://i.imgur.com/abc123.png
```

## How It Works

This MCP server provides a single tool called `upload_image` that:

1. Takes a file path as input
2. Reads the image file
3. Uploads it to Imgur using their API
4. Returns a public URL

The server uses:
- **MCP SDK** for Claude Code integration
- **Imgur API** for free, anonymous image hosting
- **TypeScript** for type safety

## Project Structure

```
mcp-image-upload/
├── src/
│   ├── index.ts          # MCP server implementation
│   └── uploaders/
│       └── imgur.ts      # Imgur upload logic
├── build/                # Compiled JavaScript
├── .env                  # Your API credentials (git ignored)
└── package.json
```

## Advanced Usage

### Other Upload Providers

The codebase is designed to support multiple providers. Check the `src/uploaders/` directory for examples of implementing:
- UploadThing
- GitHub repository storage
- AWS S3 (coming soon)

### Environment Variables

- `IMGUR_CLIENT_ID` - Required for Imgur uploads
- `DEBUG=true` - Enable debug logging

### Testing

```bash
# Test the upload functionality
node test/test-upload.js
```

## Rate Limits

- Imgur: 1,250 uploads/day (free tier)
- No authentication required
- Images are stored permanently

## Security

- `.env` file is git-ignored
- Only image files should be uploaded
- Validate file paths before uploading

## Contributing

Feel free to add more upload providers or features! The codebase is modular and easy to extend.

## License

ISC