import { cincoTecnicasResumirMejor } from "@/content/blog/5-tecnicas-resumir-mejor";
import { calcularSalarioNetoEstadosUnidos2026 } from "@/content/blog/calcular-salario-neto-estados-unidos-2026";
import { checklistLanzarTiendaOnline2026 } from "@/content/blog/checklist-lanzar-tienda-online-2026";
import { crearFacturaProfesional2026 } from "@/content/blog/crear-factura-profesional-2026";
import { guiaIaParaTareas } from "@/content/blog/guia-ia-para-tareas";
import { implementarCrmPequenaEmpresa2026 } from "@/content/blog/implementar-crm-pequena-empresa-2026";
import { impuestosFreelancerEstadosUnidos2026 } from "@/content/blog/impuestos-freelancer-estados-unidos-2026";
import { mejorCrmPequenasEmpresas2026 } from "@/content/blog/mejor-crm-pequenas-empresas-2026";
import { mejorErpPequenasEmpresas2026 } from "@/content/blog/mejor-erp-pequenas-empresas-2026";
import { mejoresPlataformasCrearTiendaOnline2026 } from "@/content/blog/mejores-plataformas-crear-tienda-online-2026";
import { mejorSoftwareFacturacionElectronica2026 } from "@/content/blog/mejor-software-facturacion-electronica-2026";
import { mejorSoftwareContabilidadPymes2026 } from "@/content/blog/mejor-software-contabilidad-pymes-2026";
import { organizarSemanaEstudio30Minutos } from "@/content/blog/organizar-semana-estudio-30-minutos";
import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  checklistLanzarTiendaOnline2026,
  implementarCrmPequenaEmpresa2026,
  mejorErpPequenasEmpresas2026,
  mejorSoftwareContabilidadPymes2026,
  mejorCrmPequenasEmpresas2026,
  impuestosFreelancerEstadosUnidos2026,
  calcularSalarioNetoEstadosUnidos2026,
  crearFacturaProfesional2026,
  mejoresPlataformasCrearTiendaOnline2026,
  mejorSoftwareFacturacionElectronica2026,
  organizarSemanaEstudio30Minutos,
  cincoTecnicasResumirMejor,
  guiaIaParaTareas,
].sort((leftPost, rightPost) => rightPost.date.localeCompare(leftPost.date));
