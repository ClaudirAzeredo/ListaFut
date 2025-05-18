"use client"

import { useState, useEffect } from "react"
import "./Teladeposicoes.css"
import campoImg from "./assets/Campo.png"

// Simple filled T-shirt SVG component that takes a color prop
const TShirtIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="tshirt-svg">
    {/* Main t-shirt body - filled with the uniform color */}
    <path d="M7 4H21V22H7V4Z" fill={color} />
    {/* Neck opening */}
    <path d="M10 4C10 5.5 12 7 14 7C16 7 18 5.5 18 4" stroke="#000000" strokeWidth="1" fill="none" />
    {/* Left sleeve */}
    <path d="M7 4L4 8V12" fill={color} stroke="#000000" strokeWidth="1" />
    {/* Right sleeve */}
    <path d="M21 4L24 8V12" fill={color} stroke="#000000" strokeWidth="1" />
    {/* Outline of the entire shirt */}
    <path d="M7 4H21L24 8V12L21 8M7 4L4 8V12L7 8M7 4V22H21V4" stroke="#000000" strokeWidth="1" fill="none" />
  </svg>
)

// PlayerSlot component with colored t-shirt icon when occupied
const PlayerSlot = ({ positionClass, onClick, player, uniformColor, onRemove }) => (
  <div className={`player-slot ${positionClass} ${player ? "occupied" : ""}`} onClick={onClick}>
    {player ? (
      <div className="player-slot-content">
        <div
          className="tshirt-icon"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <TShirtIcon color={uniformColor} />
        </div>
        <div className="player-name-display">{player}</div>
      </div>
    ) : (
      "+"
    )}
  </div>
)

const Teladeposicoes = () => {
  const [showModal, setShowModal] = useState(false)
  const [position, setPosition] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState({})
  const [confirmedPlayers, setConfirmedPlayers] = useState([])
  const [uniformColor, setUniformColor] = useState("#00b894") // Default color
  const [benchPositions, setBenchPositions] = useState([
    { id: 1, name: "1:", player: "", playerId: null },
    { id: 2, name: "2:", player: "", playerId: null },
    { id: 3, name: "3:", player: "", playerId: null },
    { id: 4, name: "4:", player: "", playerId: null },
    { id: 5, name: "5:", player: "", playerId: null },
  ])
  const [positionPlayers, setPositionPlayers] = useState({
    ATA: [],
    MC: [],
    ZAG: [],
    LAT: [],
    GOL: [],
  })
  const [showPositionPlayers, setShowPositionPlayers] = useState(false)
  const [selectedBenchSlot, setSelectedBenchSlot] = useState(null)
  const [showBenchModal, setShowBenchModal] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [playerToRemove, setPlayerToRemove] = useState({ type: "", position: "" })

  // Carregar jogadores confirmados e cor do uniforme quando a página carregar
  useEffect(() => {
    // Carregar a cor do uniforme
    const savedColor = localStorage.getItem("uniformColor")
    if (savedColor) {
      setUniformColor(savedColor)
      console.log("Cor do uniforme carregada:", savedColor)
    }

    // Carregar jogadores confirmados do localStorage
    const savedPlayers = localStorage.getItem("confirmedPlayers")
    if (savedPlayers) {
      try {
        const players = JSON.parse(savedPlayers)
        setConfirmedPlayers(players)
        console.log("Jogadores carregados:", players)
      } catch (error) {
        console.error("Erro ao carregar jogadores:", error)
      }
    } else {
      // Fallback para carregar jogadores do Firebase (se disponível)
      const jogadoresFromFirebase = localStorage.getItem("jogadoresFirebase")
      if (jogadoresFromFirebase) {
        try {
          const allPlayers = JSON.parse(jogadoresFromFirebase)
          const confirmed = allPlayers
            .filter((player) => player.presente && !player.removido)
            .map((player, index) => ({
              id: index + 1,
              name: player.nome,
            }))
          setConfirmedPlayers(confirmed)
          console.log("Jogadores carregados do Firebase:", confirmed)
        } catch (error) {
          console.error("Erro ao carregar jogadores do Firebase:", error)
        }
      }
    }

    // Carregar jogadores já selecionados para posições
    const savedSelectedPlayers = localStorage.getItem("selectedPlayers")
    if (savedSelectedPlayers) {
      try {
        setSelectedPlayers(JSON.parse(savedSelectedPlayers))
      } catch (error) {
        console.error("Erro ao carregar posições selecionadas:", error)
      }
    }

    // Carregar jogadores do banco de reservas
    const savedBenchPlayers = localStorage.getItem("benchPlayers")
    if (savedBenchPlayers) {
      try {
        setBenchPositions(JSON.parse(savedBenchPlayers))
      } catch (error) {
        console.error("Erro ao carregar jogadores do banco:", error)
      }
    }
  }, [])

  // Atualizar o banco de reservas quando os jogadores selecionados mudarem
  useEffect(() => {
    updatePositionPlayers()
  }, [selectedPlayers, confirmedPlayers, benchPositions])

  // Função para atualizar os jogadores por posição
  const updatePositionPlayers = () => {
    const positions = {
      ATA: ["CA", "PTE", "PTD"],
      MC: ["MC1", "MC2", "VOL"],
      ZAG: ["ZAG1", "ZAG2"],
      LAT: ["LE", "LD"],
      GOL: ["GOL"],
    }

    const newPositionPlayers = {
      ATA: [],
      MC: [],
      ZAG: [],
      LAT: [],
      GOL: [],
    }

    // Para cada categoria de posição
    Object.entries(positions).forEach(([category, positionCodes]) => {
      // Para cada código de posição nessa categoria
      positionCodes.forEach((posCode) => {
        // Se há um jogador selecionado para essa posição
        if (selectedPlayers[posCode]) {
          const player = confirmedPlayers.find((p) => p.id === selectedPlayers[posCode])
          if (player) {
            newPositionPlayers[category].push({
              name: player.name,
              position: posCode,
              id: player.id,
            })
          }
        }
      })
    })

    setPositionPlayers(newPositionPlayers)
  }

  const handleSlotClick = (pos) => {
    // Se já tem um jogador nessa posição, abre o modal de confirmação para remover
    if (selectedPlayers[pos]) {
      handleRemovePlayer(pos)
    } else {
      // Se não tem jogador, abre o modal para selecionar um
      setPosition(pos)
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setPosition("")
  }

  // Função para remover um jogador do banco de reservas pelo ID
  const removePlayerFromBench = (playerId) => {
    if (!playerId) return

    // Verificar se o jogador está no banco
    const benchSlot = benchPositions.find((slot) => slot.playerId === playerId)
    if (benchSlot) {
      // Remover o jogador do banco
      const updatedBench = benchPositions.map((slot) => {
        if (slot.playerId === playerId) {
          return {
            ...slot,
            player: "",
            playerId: null,
          }
        }
        return slot
      })
      setBenchPositions(updatedBench)
      localStorage.setItem("benchPlayers", JSON.stringify(updatedBench))
    }
  }

  const handlePlayerSelect = (playerId) => {
    // Atualizar a posição no campo
    const updatedSelectedPlayers = { ...selectedPlayers, [position]: playerId }
    setSelectedPlayers(updatedSelectedPlayers)
    localStorage.setItem("selectedPlayers", JSON.stringify(updatedSelectedPlayers))

    // Remover o jogador do banco de reservas se ele estiver lá
    removePlayerFromBench(playerId)

    closeModal()
  }

  const getPlayerNameById = (playerId) => {
    const player = confirmedPlayers.find((p) => p.id === playerId)
    return player ? player.name : null
  }

  const positions = ["GOL", "LE", "LD", "ZAG1", "ZAG2", "VOL", "MC1", "MC2", "PTE", "PTD", "CA"]

  const handleConfirm = () => {
    alert("Escalação pronta para pelada!")
    // Aqui você pode adicionar lógica para salvar a escalação final
  }

  // Função para filtrar jogadores por posição
  const filterPlayersByPosition = (player, pos) => {
    if (selectedPosition === "ATA" && (pos === "CA" || pos === "PTE" || pos === "PTD")) return true
    if (selectedPosition === "MC" && (pos === "MC1" || pos === "MC2" || pos === "VOL")) return true
    if (selectedPosition === "ZAG" && (pos === "ZAG1" || pos === "ZAG2")) return true
    if (selectedPosition === "LAT" && (pos === "LE" || pos === "LD")) return true
    if (selectedPosition === "GOL" && pos === "GOL") return true
    return true // Se não houver filtro específico, mostra todos
  }

  // Função para obter o nome da posição completo
  const getPositionFullName = (posCode) => {
    const positionNames = {
      GOL: "Goleiro",
      LE: "Lateral Esquerdo",
      LD: "Lateral Direito",
      ZAG1: "Zagueiro",
      ZAG2: "Zagueiro",
      VOL: "Volante",
      MC1: "Meio Campo",
      MC2: "Meio Campo",
      PTE: "Ponta Esquerda",
      PTD: "Ponta Direita",
      CA: "Centro Avante",
    }
    return positionNames[posCode] || posCode
  }

  // Função para lidar com o clique nos botões de posição
  const handlePositionButtonClick = (pos) => {
    if (selectedPosition === pos) {
      // Se clicar no mesmo botão que já está selecionado, alterna a visibilidade
      setShowPositionPlayers(!showPositionPlayers)
    } else {
      // Se clicar em um botão diferente, seleciona a posição e mostra os jogadores
      setSelectedPosition(pos)
      setShowPositionPlayers(true)
    }
  }

  // Função para lidar com o clique em um slot do banco
  const handleBenchSlotClick = (slotId) => {
    // Verificar se já tem um jogador nesse slot
    const benchSlot = benchPositions.find((slot) => slot.id === slotId)
    if (benchSlot && benchSlot.player) {
      // Se já tem jogador, abre o modal de confirmação para remover
      handleRemoveBenchPlayer(slotId)
    } else {
      // Se não tem jogador, abre o modal para selecionar um
      setSelectedBenchSlot(slotId)
      setShowBenchModal(true)
    }
  }

  // Função para fechar o modal do banco
  const closeBenchModal = () => {
    setShowBenchModal(false)
    setSelectedBenchSlot(null)
  }

  // Função para selecionar um jogador para o banco
  const handleBenchPlayerSelect = (playerId) => {
    if (selectedBenchSlot !== null) {
      const player = confirmedPlayers.find((p) => p.id === playerId)

      // Se o jogador já está em alguma posição no campo, não permitir adicionar ao banco
      if (playerId && Object.values(selectedPlayers).includes(playerId)) {
        alert("Este jogador já está em campo!")
        return
      }

      // Atualizar o banco de reservas
      const updatedBench = benchPositions.map((slot) => {
        if (slot.id === selectedBenchSlot) {
          return {
            ...slot,
            player: player ? player.name : "",
            playerId: playerId,
          }
        }
        return slot
      })

      setBenchPositions(updatedBench)

      // Salvar no localStorage
      localStorage.setItem("benchPlayers", JSON.stringify(updatedBench))

      closeBenchModal()
    }
  }

  // Função para obter jogadores disponíveis para o banco
  const getAvailableBenchPlayers = () => {
    // Obter IDs dos jogadores já selecionados para posições
    const usedPlayerIds = Object.values(selectedPlayers)

    // Obter IDs dos jogadores já no banco (exceto o slot atual)
    const benchPlayerIds = benchPositions
      .filter((slot) => slot.id !== selectedBenchSlot && slot.playerId)
      .map((slot) => slot.playerId)

    // Combinar todos os IDs usados
    const allUsedIds = [...usedPlayerIds, ...benchPlayerIds]

    // Retornar jogadores não utilizados
    return confirmedPlayers.filter((player) => !allUsedIds.includes(player.id))
  }

  // Função para remover jogador de uma posição
  const handleRemovePlayer = (pos) => {
    setPlayerToRemove({ type: "field", position: pos })
    setShowRemoveConfirm(true)
  }

  // Função para remover jogador do banco
  const handleRemoveBenchPlayer = (slotId) => {
    setPlayerToRemove({ type: "bench", position: slotId })
    setShowRemoveConfirm(true)
  }

  // Função para confirmar a remoção do jogador
  const confirmRemovePlayer = () => {
    if (playerToRemove.type === "field") {
      // Remover jogador do campo
      const updatedSelectedPlayers = { ...selectedPlayers }
      delete updatedSelectedPlayers[playerToRemove.position]
      setSelectedPlayers(updatedSelectedPlayers)
      localStorage.setItem("selectedPlayers", JSON.stringify(updatedSelectedPlayers))
    } else if (playerToRemove.type === "bench") {
      // Remover jogador do banco
      const updatedBench = benchPositions.map((slot) => {
        if (slot.id === playerToRemove.position) {
          return {
            ...slot,
            player: "",
            playerId: null,
          }
        }
        return slot
      })
      setBenchPositions(updatedBench)
      localStorage.setItem("benchPlayers", JSON.stringify(updatedBench))
    }

    setShowRemoveConfirm(false)
    setPlayerToRemove({ type: "", position: "" })
  }

  // Função para cancelar a remoção do jogador
  const cancelRemovePlayer = () => {
    setShowRemoveConfirm(false)
    setPlayerToRemove({ type: "", position: "" })
  }

  return (
    <div className="posicoes-page">
      <div className="posicoes-container">
        <h1 className="posicoes-title">Escalação da Pelada</h1>

        <div className="field-container">
          <div className="field-area">
            <div className="field" style={{ backgroundImage: `url(${campoImg})` }}>
              {positions.map((pos) => (
                <PlayerSlot
                  key={pos}
                  positionClass={pos}
                  onClick={() => handleSlotClick(pos)}
                  player={getPlayerNameById(selectedPlayers[pos])}
                  uniformColor={uniformColor}
                  onRemove={() => handleRemovePlayer(pos)}
                />
              ))}
            </div>
          </div>

          <div className="bench-area">
            <h2 className="bench-title">Banco:</h2>
            <div className="bench-list">
              {benchPositions.map((position) => (
                <div
                  key={position.id}
                  className={`bench-item ${position.player ? "bench-item-filled" : ""}`}
                  onClick={() => handleBenchSlotClick(position.id)}
                >
                  <span className="bench-position">{position.name}</span>
                  <span className="bench-player">{position.player || ""}</span>
                  {position.player && (
                    <div className="bench-player-icon">
                      <TShirtIcon color={uniformColor} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="position-selector">
          <h2 className="position-title">Posição</h2>
          <div className="position-buttons">
            <button
              className={`position-button ${selectedPosition === "ATA" ? "selected" : ""}`}
              onClick={() => handlePositionButtonClick("ATA")}
            >
              ATA
            </button>
            <button
              className={`position-button ${selectedPosition === "MC" ? "selected" : ""}`}
              onClick={() => handlePositionButtonClick("MC")}
            >
              MC
            </button>
            <button
              className={`position-button ${selectedPosition === "ZAG" ? "selected" : ""}`}
              onClick={() => handlePositionButtonClick("ZAG")}
            >
              ZAG
            </button>
            <button
              className={`position-button ${selectedPosition === "LAT" ? "selected" : ""}`}
              onClick={() => handlePositionButtonClick("LAT")}
            >
              LAT
            </button>
            <button
              className={`position-button ${selectedPosition === "GOL" ? "selected" : ""}`}
              onClick={() => handlePositionButtonClick("GOL")}
            >
              GOL
            </button>
          </div>
        </div>

        {/* Exibição de jogadores por posição - só aparece quando uma posição é selecionada */}
        {selectedPosition && showPositionPlayers && (
          <div className="position-players-display">
            <h3 className="position-players-title">Jogadores na posição {selectedPosition}:</h3>
            <div className="position-players-list">
              {positionPlayers[selectedPosition].length > 0 ? (
                positionPlayers[selectedPosition].map((player, index) => (
                  <div key={index} className="position-player-item">
                    <div className="position-player-icon" onClick={() => handleRemovePlayer(player.position)}>
                      <TShirtIcon color={uniformColor} />
                    </div>
                    <div className="position-player-info">
                      <span className="position-player-name">{player.name}</span>
                      <span className="position-player-position">{getPositionFullName(player.position)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-position-players">Nenhum jogador nesta posição</p>
              )}
            </div>
          </div>
        )}

        <button className="confirm-button" onClick={handleConfirm}>
          Validar escalação
        </button>

        {/* Modal para selecionar jogador para posição no campo */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Selecione um jogador para {position}</h3>

              {confirmedPlayers.length > 0 ? (
                <div className="player-list">
                  {confirmedPlayers
                    .filter(
                      (player) =>
                        !Object.values(selectedPlayers).includes(player.id) || selectedPlayers[position] === player.id,
                    )
                    .filter((player) => filterPlayersByPosition(player, position))
                    .map((player) => (
                      <div
                        key={player.id}
                        className={`player-option ${selectedPlayers[position] === player.id ? "selected" : ""}`}
                        onClick={() => handlePlayerSelect(player.id)}
                      >
                        {player.name}
                        {benchPositions.some((slot) => slot.playerId === player.id) && (
                          <span className="bench-indicator"> (Banco)</span>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="no-players-message">
                  Nenhum jogador disponível. Adicione jogadores na tela de lista primeiro.
                </p>
              )}

              <button onClick={closeModal} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal para selecionar jogador para o banco */}
        {showBenchModal && (
          <div className="modal-overlay" onClick={closeBenchModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Selecione um jogador para o banco</h3>

              {confirmedPlayers.length > 0 ? (
                <div className="player-list">
                  {getAvailableBenchPlayers().map((player) => (
                    <div key={player.id} className="player-option" onClick={() => handleBenchPlayerSelect(player.id)}>
                      {player.name}
                    </div>
                  ))}

                  {/* Opção para remover jogador do banco */}
                  {benchPositions.find((slot) => slot.id === selectedBenchSlot)?.player && (
                    <div className="player-option remove-option" onClick={() => handleBenchPlayerSelect(null)}>
                      Remover jogador
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-players-message">
                  Nenhum jogador disponível. Adicione jogadores na tela de lista primeiro.
                </p>
              )}

              {getAvailableBenchPlayers().length === 0 && (
                <p className="no-players-message">Todos os jogadores já estão em campo ou no banco.</p>
              )}

              <button onClick={closeBenchModal} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmação para remover jogador */}
        {showRemoveConfirm && (
          <div className="modal-overlay" onClick={cancelRemovePlayer}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Remover Jogador</h3>
              <p>Tem certeza que deseja remover este jogador?</p>
              <div className="confirm-buttons">
                <button className="confirm-yes" onClick={confirmRemovePlayer}>
                  Sim
                </button>
                <button className="confirm-no" onClick={cancelRemovePlayer}>
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Teladeposicoes
