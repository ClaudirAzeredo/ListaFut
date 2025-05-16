"use client"

import { useEffect, useState } from "react"
import { ref, onValue, set } from "firebase/database"
import { database } from "./firebase"
import { useNavigate, useLocation } from "react-router-dom"
import "./App.css"

export default function App() {
  const [jogadores, setJogadores] = useState([])
  const [nome, setNome] = useState("")
  const [corUniforme, setCorUniforme] = useState("#00b894")
  const [listaNome, setListaNome] = useState("Lista da Pelada")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Tenta obter o nome da lista da URL, localStorage ou sessionStorage
    const getListName = () => {
      // Verifica se há um nome de lista nos parâmetros da URL
      const params = new URLSearchParams(location.search)
      const listNameFromUrl = params.get("listName")

      // Verifica se há um nome de lista no localStorage
      const listNameFromStorage = localStorage.getItem("listName")

      // Verifica se há um nome de lista no sessionStorage
      const listNameFromSession = sessionStorage.getItem("listName")

      // Usa o primeiro valor disponível, com prioridade para URL, depois localStorage, depois sessionStorage
      if (listNameFromUrl) {
        return decodeURIComponent(listNameFromUrl)
      } else if (listNameFromStorage) {
        return listNameFromStorage
      } else if (listNameFromSession) {
        return listNameFromSession
      } else {
        return "Lista da Pelada" // Valor padrão
      }
    }

    setListaNome(getListName())

    const jogadoresRef = ref(database, "jogadores")
    onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setJogadores(data)
        // Salvar jogadores no localStorage para uso na tela de posições
        localStorage.setItem("jogadoresFirebase", JSON.stringify(data))
      } else {
        setJogadores([])
      }
    })
  }, [location])

  const salvarNoFirebase = (lista) => {
    set(ref(database, "jogadores"), lista)
  }

  const adicionarJogador = () => {
    const nomeLimpo = nome.replace(/\\/g, "").trim()
    if (nomeLimpo !== "") {
      const nomeExiste = jogadores.some((j) => j.nome.toLowerCase() === nomeLimpo.toLowerCase())
      if (!nomeExiste) {
        const novaLista = [...jogadores, { nome: nomeLimpo, presente: false, emoji: "", removido: false }]
        salvarNoFirebase(novaLista)
        setNome("")
      } else {
        alert("Jogador já está na lista!")
      }
    }
  }

  const removerJogador = (index) => {
    const novaLista = [...jogadores]
    const emoji = Math.random() > 0.5 ? "🚺" : "🤕"
    novaLista[index].removido = true
    novaLista[index].emoji = emoji
    novaLista[index].presente = false
    salvarNoFirebase(novaLista)
  }

  const restaurarJogador = (index) => {
    const novaLista = [...jogadores]
    novaLista[index].emoji = ""
    novaLista[index].removido = false
    salvarNoFirebase(novaLista)
  }

  const criarNovaLista = () => {
    salvarNoFirebase([])
  }

  const alternarPresenca = (index) => {
    const novaLista = [...jogadores]
    novaLista[index].presente = !novaLista[index].presente
    salvarNoFirebase(novaLista)
  }

  const validarLista = () => {
    // Salvar jogadores confirmados no localStorage para uso na tela de posições
    const confirmedPlayers = jogadores
      .filter((jogador) => jogador.presente && !jogador.removido)
      .map((jogador, index) => ({
        id: index + 1,
        name: jogador.nome,
      }))

    // Salvar a cor do uniforme no localStorage
    localStorage.setItem("uniformColor", corUniforme)

    localStorage.setItem("confirmedPlayers", JSON.stringify(confirmedPlayers))
    navigate("/formacao")
  }

  return (
    <div className="gerenciar-page">
      <div className="gerenciar-container">
        <h1 className="gerenciar-title">{listaNome}</h1>

        <div className="gerenciar-content">
          <div className="add-player-form">
            <input
              type="text"
              className="player-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do Boleiro:"
            />
            <button className="add-button" onClick={adicionarJogador}>
              Adicionar
            </button>
          </div>

          <h2 className="section-title">Boleiros:</h2>
          <div className="players-list">
            {jogadores
              .filter((jogador) => !jogador.removido)
              .map((jogador, index) => {
                const originalIndex = jogadores.findIndex((j) => j.nome === jogador.nome)
                return (
                  <div key={originalIndex} className="player-item">
                    <span className="player-name">{jogador.nome}</span>
                    <div className="player-actions">
                      <button className="remove-button" onClick={() => removerJogador(originalIndex)}>
                        X
                      </button>
                      <button
                        className={`confirm-button ${jogador.presente ? "confirmed" : ""}`}
                        onClick={() => alternarPresenca(originalIndex)}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>

          <h2 className="section-title">Removidos:</h2>
          <div className="players-list removed-list">
            {jogadores
              .filter((jogador) => jogador.removido)
              .map((jogador, index) => {
                const originalIndex = jogadores.findIndex((j) => j.nome === jogador.nome)
                return (
                  <div key={originalIndex} className="player-item removed-player">
                    <span className="player-name">
                      {jogador.nome} {jogador.emoji}
                    </span>
                    <button className="restaurar-btn" onClick={() => restaurarJogador(originalIndex)}>
                      🔄
                    </button>
                  </div>
                )
              })}
          </div>

          <h2 className="section-title">Confirmados:</h2>
          <div className="players-list confirmed-list">
            {jogadores
              .filter((jogador) => jogador.presente && !jogador.removido)
              .map((jogador, index) => {
                const originalIndex = jogadores.findIndex((j) => j.nome === jogador.nome)
                return (
                  <div
                    key={originalIndex}
                    className="player-item confirmed-player"
                    style={{ backgroundColor: corUniforme }}
                  >
                    <span className="player-name">{jogador.nome}</span>
                    <button className="confirm-button confirmed" onClick={() => alternarPresenca(originalIndex)}>
                      ✓
                    </button>
                  </div>
                )
              })}
          </div>

          <div className="color-picker-container">
            <span>Selecione a cor do uniforme:</span>
            <input
              type="color"
              value={corUniforme}
              onChange={(e) => setCorUniforme(e.target.value)}
              className="color-picker"
            />
            <div className="color-preview" style={{ backgroundColor: corUniforme }}></div>
          </div>

          <div className="button-container">
            <button onClick={criarNovaLista} className="list-button new-list">
              Nova Lista
            </button>
            <button onClick={validarLista} className="list-button validate-list">
              Validar Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
