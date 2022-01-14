`npm init -y`
`npm i -D typescript ts-node`
`npx tsc --init`
`mkdir src`
`touch src/index.ts`

```ts
// Parameter 'number' implicitly has an 'any' type`
function test(number) {
  return number + 1;
}

console.log(test(1));
```

`"noImplicitAny": false`

This will also works, however with incorrect infered type

```ts
class Metadata {
  constructor() {
    return Promise.resolve({ p: 42 });
  }
}

(async function () {
  const r = await new Metadata();
  console.log(r);
})();
```

BTW, with JS and VsCode it infers type incorrectly aswell

```ts
const API = { USER: `/user` };
async function fetchApi(url, options, mapper) {
  const response = await Promise.resolve({
    url,
    method: options.method,
    data: JSON.stringify({ name: "Jhon", secondName: "Dou" }),
  });
  const result = mapper(JSON.parse(response.data));
  return result;
}

const userMapper = (data) => ({
  fullName: `${data.name} ${data.secondName}`,
});

(async function () {
  const result = await fetchApi(
      API.USER, 
      { method: "POST" }, 
      (data) => userMapper(data)
  );

  console.log(result.fullName);
})();
```
