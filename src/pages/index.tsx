import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import {
  Box,
  HStack,
  Textarea,
  Select,
  Heading,
  Container,
  VStack,
  Stack,
  Button,
  Spacer,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";

import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

enum DevEnv {
  Nextjs = "Next.js",
  React = "React",
  Vite = "Vite",
}

const prefix: Record<DevEnv, string> = {
  [DevEnv.Nextjs]: "NEXT_PUBLIC_",
  [DevEnv.React]: "REACT_APP_",
  [DevEnv.Vite]: "VITE_",
};

const envPrefix: Record<DevEnv, string> = {
  [DevEnv.Nextjs]: "process.env.",
  [DevEnv.React]: "process.env.",
  [DevEnv.Vite]: "import.meta.env.",
};

export default function Home() {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const toast = useToast();

  const [input, setInput] = useState("");
  const [selectedDevEnv, setSelectedDevEnv] = useState<DevEnv>(DevEnv.Nextjs);
  const [download, setDownload] = useState("");

  const textReplace = (input: string) => {
    return input
      .replace("apiKey", getPrefix(selectedDevEnv) + "API_KEY")
      .replace("authDomain", getPrefix(selectedDevEnv) + "AUTH_DOMAIN")
      .replace("projectId", getPrefix(selectedDevEnv) + "PROJECT_ID")
      .replace("storageBucket", getPrefix(selectedDevEnv) + "STORAGE_BUCKET")
      .replace(
        "messagingSenderId",
        getPrefix(selectedDevEnv) + "MESSAGING_SENDER_ID"
      )
      .replace("measurementId", getPrefix(selectedDevEnv) + "MEASUREMENT_ID")
      .replace("appId", getPrefix(selectedDevEnv) + "APP_ID")
      .replace(/"/g, "")
      .replace(/: /g, "=")
      .replace(/,/g, "")
      .replace(/[^\S\r\n]+/g, "");
  };

  const getPrefix = (env: DevEnv): string => {
    switch (env) {
      case DevEnv.Nextjs:
        return prefix["Next.js"];
      case DevEnv.React:
        return prefix.React;
      case DevEnv.Vite:
        return prefix.Vite;
    }
  };

  const getEnvPrefix = (env: DevEnv): string => {
    switch (env) {
      case DevEnv.Nextjs:
        return envPrefix["Next.js"];
      case DevEnv.React:
        return envPrefix.React;
      case DevEnv.Vite:
        return envPrefix.Vite;
    }
  };

  const placeholder = `apiKey: "xxxxxxxxxx",
authDomain: "xxxxxxxxxx",
projectId: "xxxxxxxxxx",
storageBucket: "xxxxxxxxxx",
messagingSenderId: "xxxxxxxxxx",
appId: "xxxxxxxxxx"`;

  const firebasejsText = `import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: ${getEnvPrefix(selectedDevEnv)}${getPrefix(selectedDevEnv)}API_KEY,
  authDomain: ${getEnvPrefix(selectedDevEnv)}${getPrefix(
    selectedDevEnv
  )}AUTH_DOMAIN,
  projectId: ${getEnvPrefix(selectedDevEnv)}${getPrefix(
    selectedDevEnv
  )}PROJECT_ID,
  storageBucket: ${getEnvPrefix(selectedDevEnv)}${getPrefix(
    selectedDevEnv
  )}STORAGE_BUCKET,
  messagingSenderId: ${getEnvPrefix(selectedDevEnv)}${getPrefix(
    selectedDevEnv
  )}MESSAGING_SENDER_ID,
  appId: ${getEnvPrefix(selectedDevEnv)}${getPrefix(selectedDevEnv)}APP_ID,
  measurementId: ${getEnvPrefix(selectedDevEnv)}${getPrefix(
    selectedDevEnv
  )}MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // initialize auth
const firestore = getFirestore(app); // initialize firestore
const storage = getStorage(app); // initialize storage

export { app, auth, firestore, storage }; `;

  const replacededPlaceholder = textReplace(placeholder);

  const replacedValue = textReplace(input);

  const handleSelectDevEnv = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevEnv(event.target.value as DevEnv);
  };

  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setInput(inputValue);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(replacedValue)
    );
    link.setAttribute("download", ".env.example");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFirebaseDownload = () => {
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(firebasejsText)
    );
    link.setAttribute("download", "firebase.js");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string) => {
    setValue(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onCopy();
  };

  useEffect(() => {
    if (value) {
      onCopy();
    }
  }, [value]);

  return (
    <>
      <Head>
        <title>FirebaseConfig to Env</title>
        <meta
          name="description"
          content="Convet firebaseconfig text to env file format"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container pt={2} maxW="6xl">
        <Heading pt={8}>FirebaseConfig to Env</Heading>
        {/* <Center> */}
        <Box>
          <Text> </Text>
          <HStack spacing={8}>
            <Box width={"20%"} py={6}>
              <Select value={selectedDevEnv} onChange={handleSelectDevEnv}>
                <option value={DevEnv.Nextjs}>{DevEnv.Nextjs}</option>
                <option value={DevEnv.React}>{DevEnv.React}</option>
                <option value={DevEnv.Vite}>{DevEnv.Vite}</option>
              </Select>
            </Box>
            <Spacer />
            <HStack>
              <Button
                isDisabled={!replacedValue}
                onClick={() => handleCopy(replacedValue)}
              >
                Copy
              </Button>

              <Button isDisabled={!replacedValue} onClick={handleDownload}>
                Download .env
              </Button>
            </HStack>
          </HStack>
          <HStack spacing={8}>
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder={placeholder}
              size={"sm"}
              height={200}
              // width={}
            />
            <Textarea
              isReadOnly
              height={200}
              size={"sm"}
              placeholder={replacededPlaceholder}
              value={replacedValue}
              // onClick={handleCopy}
            />
          </HStack>

          <Box py={8}>
            <HStack pb={4}>
              <Text>firebase.js sample</Text>
              <Spacer />
              <HStack>
                <Button
                  onClick={() => {
                    handleCopy(firebasejsText);
                  }}
                  onCopy={onCopy}
                >
                  Copy
                </Button>

                <Button onClick={handleFirebaseDownload}>Download</Button>
              </HStack>
            </HStack>
            <SyntaxHighlighter language={"node"} style={monokaiSublime}>
              {firebasejsText}
            </SyntaxHighlighter>
          </Box>
        </Box>
        {/* </Center> */}
      </Container>
    </>
  );
}
