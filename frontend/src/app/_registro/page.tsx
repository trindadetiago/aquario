"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { env } from "@/lib/env";

// Tipos para os dados do backend
type Centro = {
  id: string;
  nome: string;
  sigla: string;
};

type Curso = {
  id: string;
  nome: string;
};

export default function Registro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<"DISCENTE" | "DOCENTE">("DISCENTE");
  const [centroId, setCentroId] = useState("");
  const [cursoId, setCursoId] = useState("");

  const [centros, setCentros] = useState<Centro[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({ score: 0, message: "", color: "" });
  const router = useRouter();

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let message = "";
    let color = "";

    if (password.length === 0) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    if (password.length < 8) {
      setPasswordStrength({
        score: 0,
        message: "Senha muito curta (mínimo 8 caracteres)",
        color: "text-red-500",
      });
      return;
    }

    if (password.length >= 8) {
      score++;
    }
    if (password.match(/[a-z]/)) {
      score++;
    }
    if (password.match(/[A-Z]/)) {
      score++;
    }
    if (password.match(/[0-9]/)) {
      score++;
    }
    if (password.match(/[^a-zA-Z0-9]/)) {
      score++;
    }

    switch (score) {
      case 0:
      case 1:
      case 2:
        message = "Senha fraca";
        color = "text-red-500";
        break;
      case 3:
        message = "Senha média";
        color = "text-yellow-500";
        break;
      case 4:
        message = "Senha forte";
        color = "text-green-500";
        break;
      case 5:
        message = "Senha muito forte";
        color = "text-green-600";
        break;
    }

    setPasswordStrength({ score, message, color });
  };

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const response = await fetch(`${env.apiUrl}/centros`);
        if (!response.ok) {
          throw new Error("Falha ao buscar centros");
        }
        const data = await response.json();
        setCentros(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCentros();
  }, []);

  useEffect(() => {
    if (!centroId) {
      setCursos([]);
      setCursoId("");
      return;
    }
    const fetchCursos = async () => {
      try {
        const response = await fetch(`${env.apiUrl}/centros/${centroId}/cursos`);
        if (!response.ok) {
          throw new Error("Falha ao buscar cursos");
        }
        const data = await response.json();
        setCursos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCursos();
  }, [centroId]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (senha.length < 8) {
      setError("Senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!/[A-Z]/.test(senha)) {
      setError("Senha deve conter pelo menos uma letra maiúscula");
      return;
    }

    if (!/[a-z]/.test(senha)) {
      setError("Senha deve conter pelo menos uma letra minúscula");
      return;
    }

    if (!/[0-9]/.test(senha)) {
      setError("Senha deve conter pelo menos um número");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${env.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          papel,
          centroId,
          cursoId: papel === "DISCENTE" ? cursoId : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha no registro");
      }

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-2 bg-gray-50 dark:bg-transparent">
      <div className="grid w-full max-w-7xl h-auto gap-0 lg:grid-cols-2 border border-gray-200 dark:border-gray-700 dark:bg-transparent rounded-lg overflow-hidden my-12">
        <div className="relative hidden lg:flex items-center justify-center bg-sky-300 dark:bg-sky-800">
          <Image
            src="/logo_removebg.png"
            alt="Logo"
            width={96}
            height={96}
            className="absolute top-6 left-6 object-contain"
          />
        </div>

        <div className="flex items-center justify-center p-6 md:p-8 bg-white dark:bg-transparent">
          <form
            onSubmit={handleRegister}
            className="w-full max-w-md space-y-6 flex flex-col items-center"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Crie sua conta</h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Preencha os campos para se registrar
              </p>
            </div>

            <div className="space-y-4 w-full max-w-xs">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={senha}
                  onChange={e => {
                    setSenha(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  required
                />
                {senha && passwordStrength.message && (
                  <p className={`text-xs ${passwordStrength.color}`}>{passwordStrength.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Mínimo 8 caracteres, incluindo maiúscula, minúscula e número
                </p>
              </div>
              <div className="space-y-2">
                <Label>Você é?</Label>
                <Select
                  onValueChange={(value: "DISCENTE" | "DOCENTE") => setPapel(value)}
                  defaultValue={papel}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DISCENTE">Aluno(a)</SelectItem>
                    <SelectItem value="DOCENTE">Professor(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Centro</Label>
                <Select onValueChange={setCentroId} value={centroId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu centro" />
                  </SelectTrigger>
                  <SelectContent>
                    {centros.map(centro => (
                      <SelectItem key={centro.id} value={centro.id}>
                        {centro.sigla} - {centro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {papel === "DISCENTE" && (
                <div className="space-y-2">
                  <Label>Curso</Label>
                  <Select
                    onValueChange={setCursoId}
                    value={cursoId}
                    disabled={!centroId || cursos.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {cursos.map(curso => (
                        <SelectItem key={curso.id} value={curso.id}>
                          {curso.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </div>
            <p className="text-center text-sm">
              Já tem uma conta?{" "}
              <a href="/login" className="font-semibold text-sky-500 hover:underline">
                Faça login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
