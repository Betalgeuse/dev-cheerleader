# Contributing to Dev Cheerleader

새로운 ASCII 캐릭터와 메시지 기여를 환영합니다!

## How to Contribute

1. Fork this repository
2. Add your ASCII art or messages to `src/cheerleader.ts`
3. Run `./build.sh` to test
4. Submit a Pull Request

## Character Guidelines

### Allowed
- Original characters you created
- Generic human/animal shapes
- Abstract ASCII art
- Emoticons and kaomoji

### NOT Allowed
- Disney characters (Mickey, Elsa, etc.)
- Nintendo characters (Mario, Pikachu, etc.)
- Anime/game characters
- Any copyrighted IP

```
Good:
   \(^o^)/    ← Generic happy person
    /|\
    / \

Bad:
   ⚡️
  (°Pokemon°)  ← Copyrighted character
   /Pokemon\
```

## Adding New ASCII Art

Edit `ASCII_CHEERLEADERS` in `src/cheerleader.ts`:

```typescript
const ASCII_CHEERLEADERS = {
    welcome: [
        String.raw`
   \(^o^)/   Your message here!
    /|\
    / \
        `,
        // Add your ASCII here
    ],
    // ...
};
```

## Adding New Messages

Edit `MESSAGES` in `src/cheerleader.ts`:

```typescript
const MESSAGES = {
    welcome: [
        "Your encouraging message here!",
        // Add your message
    ],
    // ...
};
```

## Testing

```bash
cd .factory/hooks
npm install
./build.sh

# Test each hook
echo '{"session_id":"test","cwd":"/test"}' | CHEERLEADER_HOOK_TYPE=session_start node dist/cheerleader.mjs
echo '{"session_id":"test","cwd":"/test"}' | CHEERLEADER_HOOK_TYPE=pre_compact node dist/cheerleader.mjs
echo '{"session_id":"test","cwd":"/test","tool_output":"Error: test"}' | CHEERLEADER_HOOK_TYPE=post_tool_use node dist/cheerleader.mjs
```

## Code of Conduct

- Be respectful and inclusive
- Keep messages positive and encouraging
- No offensive or inappropriate content

## Questions?

Open an issue if you have any questions!
