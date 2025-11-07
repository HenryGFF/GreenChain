#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cjson/cJSON.h>

#define HASH_BUFFER 64

typedef struct historyBlock {
    char id_empresa[256];
    char acao[256];
    char hash[256];
    char hash_anterior[256];
    struct historyBlock *next;
} historyBlock;

typedef struct componenteBlock {
    char id_externo[256];
    char categoria[256];
    char marca[256];
    char modelo[256];
    char numero_serie[256];
    char data_fabricacao[256];
    char descricao_tecnica[256];
    char origem[256];
} componenteBlock;

typedef struct Results {
    historyBlock *blockchain;
    componenteBlock *componenteCadastro;
} Results;

typedef struct MapBlock {
    const char *jsonkey;
    char *conteudo;
    size_t tamanho;
} MapBlock;


static void safe_copy(char *dest, size_t dest_size, const char *src) {
    if (!dest || dest_size == 0) return;
    if (!src) { dest[0] = '\0'; return; }
    strncpy(dest, src, dest_size - 1);
    dest[dest_size - 1] = '\0';
}

Results parse_JSON(const char* jsonArray) {
    Results empty = {NULL, NULL};
    if (!jsonArray) return empty;

    cJSON *root = cJSON_Parse(jsonArray);
    if (!root) {
        fprintf(stderr, "DEBUG: cJSON_Parse returned NULL\n");
        return empty;
    }

    cJSON *array = NULL;
    if (cJSON_IsArray(root)) {
        array = root;
    } else {
   
        array = cJSON_CreateArray();
        cJSON_AddItemToArray(array, cJSON_Duplicate(root, 1));

    }

    int jsonSize = cJSON_GetArraySize(array);
    if (jsonSize <= 0) {
        fprintf(stderr, "DEBUG: json array vazio ou inválido\n");
        cJSON_Delete(root);
        return empty;
    }

    historyBlock *primeiro = NULL;
    historyBlock *ultimo = NULL;
    componenteBlock *componente = calloc(1, sizeof(componenteBlock));
    if (!componente) {
        fprintf(stderr, "DEBUG: malloc componente falhou\n");
        cJSON_Delete(root);
        return empty;
    }

    for (int i = 0; i < jsonSize; i++) {
        cJSON *object = cJSON_GetArrayItem(array, i);
        if (!object) {
            fprintf(stderr, "DEBUG: item %d do array é NULL\n", i);
            continue;
        }

        if (i < jsonSize - 1) {
            historyBlock *atual = calloc(1, sizeof(historyBlock));
            if (!atual) {
                fprintf(stderr, "DEBUG: malloc history falhou\n");
                continue;
            }
            atual->next = NULL;

            MapBlock map[] = {
                {"id_empresa", atual->id_empresa, sizeof(atual->id_empresa)},
                {"acao", atual->acao, sizeof(atual->acao)},
                {"hash", atual->hash, sizeof(atual->hash)},
                {"hash_anterior", atual->hash_anterior, sizeof(atual->hash_anterior)}
            };

            for (size_t j = 0; j < sizeof(map)/sizeof(map[0]); j++) {
                cJSON *tmp = cJSON_GetObjectItemCaseSensitive(object, map[j].jsonkey);
                if (cJSON_IsNull(tmp)) map[j].conteudo[0] = '\0';
                if (tmp && cJSON_IsString(tmp) && tmp->valuestring) {
                    safe_copy(map[j].conteudo, map[j].tamanho, tmp->valuestring);
                } else if (tmp && cJSON_IsNumber(tmp)) {
                    char buf[64];
                    snprintf(buf, sizeof(buf), "%g", tmp->valuedouble);
                    safe_copy(map[j].conteudo, map[j].tamanho, buf);
                } else {
                    map[j].conteudo[0] = '\0';
                }
            }

            if (primeiro == NULL) {
                primeiro = atual;
                ultimo = atual;
            } else {
                ultimo->next = atual;
                ultimo = atual;
            }
        } else {
         
            MapBlock map[] = {
                {"id_externo", componente->id_externo, sizeof(componente->id_externo)},
                {"categoria", componente->categoria, sizeof(componente->categoria)},
                {"marca", componente->marca, sizeof(componente->marca)},
                {"modelo", componente->modelo, sizeof(componente->modelo)},
                {"numero_serie", componente->numero_serie, sizeof(componente->numero_serie)},
                {"data_fabricacao", componente->data_fabricacao, sizeof(componente->data_fabricacao)},
                {"descricao_tecnica", componente->descricao_tecnica, sizeof(componente->descricao_tecnica)},
                {"origem", componente->origem, sizeof(componente->origem)},
            };

            for (size_t j = 0; j < sizeof(map)/sizeof(map[0]); j++) {
                cJSON *tmp = cJSON_GetObjectItemCaseSensitive(object, map[j].jsonkey);
                if (tmp && cJSON_IsString(tmp) && tmp->valuestring) {
                    safe_copy(map[j].conteudo, map[j].tamanho, tmp->valuestring);
                } else if (tmp && cJSON_IsNumber(tmp)) {
                    char buf[64];
                    snprintf(buf, sizeof(buf), "%g", tmp->valuedouble);
                    safe_copy(map[j].conteudo, map[j].tamanho, buf);
                } else {
                    map[j].conteudo[0] = '\0';
                }
            }
        }
    }

    Results res;
    res.blockchain = primeiro;
    res.componenteCadastro = componente;

    cJSON_Delete(root);
    return res;
}


unsigned int somaAsciiUniversal(historyBlock* blockchain, historyBlock* blocoAtual, componenteBlock* block) {
    if (!block) return 0;

    unsigned int soma = 0;

    const char* camposComponente[] = {
        block->id_externo,
        block->categoria, block->marca, block->modelo, block->numero_serie,
    };

    for (int i = 0; i < sizeof(camposComponente)/sizeof(camposComponente[0]); i++) {
        const char* txt = camposComponente[i] ? camposComponente[i] : "";
        for (int j = 0; txt[j] != '\0'; j++) soma += (unsigned int)txt[j];
    }

    historyBlock* atual = blockchain;
    while (atual) {
        const char* camposHistory[] = {
            atual->id_empresa, atual->acao, atual->hash_anterior
        };
        for (int k = 0; k < sizeof(camposHistory)/sizeof(camposHistory[0]); k++) {
            const char* txt = camposHistory[k] ? camposHistory[k] : "";
            for (int j = 0; txt[j] != '\0'; j++) soma += (unsigned int)txt[j];
        }
        if (atual == blocoAtual) break;
        atual = atual->next;
    }

    return soma;
}

unsigned int manipularBinario(unsigned int somaAscii, componenteBlock* componente) {
    if (!componente) return 0;
    const char* vars[] = { componente->id_externo, componente->data_fabricacao };
    unsigned int soma[2] = {0,0};
    for (int i = 0; i < 2; i++) {
        const char* txt = vars[i] ? vars[i] : "";
        for (int j = 0; txt[j] != '\0'; j++) soma[i] += (unsigned int)txt[j];
    }
    unsigned int a = soma[0], b = soma[1], c = 10;
    unsigned int codigo = (((~somaAscii) ^ a) << c) | (b ^ (somaAscii >> 3));
    codigo ^= (codigo >> 16);
    if (codigo == 0) codigo = 1;
    return codigo;
}

char* gerarHexa(unsigned int codigo) {
    char* hash = malloc(HASH_BUFFER);
    if (!hash) return NULL;
    snprintf(hash, HASH_BUFFER, "%010x", codigo);
    return hash;
}

char* gerarHash(historyBlock* blockchain, componenteBlock* componente) {
    if (!blockchain || !componente) return NULL;

   
    historyBlock *blocoAtual = blockchain;
    while (blocoAtual->next) {
        blocoAtual = blocoAtual->next;
    }

  
    unsigned int codigoAscii = somaAsciiUniversal(blockchain, blocoAtual, componente);
    unsigned int codigoBin = manipularBinario(codigoAscii, componente);
    return gerarHexa(codigoBin);
}


int main(){
    char buffer[4096];
    size_t lidos = fread(buffer, 1, sizeof(buffer)-1, stdin);
    buffer[lidos] = '\0';

    Results blocks = parse_JSON(buffer);
    char* hash = gerarHash(blocks.blockchain, blocks.componenteCadastro);

    cJSON *obj = cJSON_CreateObject();
    cJSON_AddStringToObject(obj, "hash", hash);

    char *jsonString = cJSON_PrintUnformatted(obj);
    printf("%s\n", jsonString);

    free(jsonString);
    cJSON_Delete(obj);

    free(hash);
    historyBlock *atual = blocks.blockchain;
    while (atual) {
        historyBlock *tmp = atual->next;
        free(atual);
        atual = tmp;
    }
    free(blocks.componenteCadastro);

    return 0;
}