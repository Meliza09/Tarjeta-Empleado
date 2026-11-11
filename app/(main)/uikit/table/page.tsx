'use client';

import React, { useMemo, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

/* ───────────── Tipos ───────────── */
interface Producto {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number; // precio unitario
}

const IVA = 0.16; // 16 %

const productosIniciales: Producto[] = [
    { id: 1, nombre: 'Impresora LaserJet Color', cantidad: 2, precio: 5200 },
    { id: 2, nombre: 'Monitor LED 31 plg.', cantidad: 3, precio: 1700 }
];

const moneda = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

/* ───────────── Componente ───────────── */
const PuntoDeVenta = () => {
   
    const [productos, setProductos] = useState<Producto[]>(productosIniciales);
    const [siguienteId, setSiguienteId] = useState(3);

    // Formulario de registro
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState<number | null>(null);
    const [precio, setPrecio] = useState<number | null>(null);
    const nombreRef = useRef<HTMLInputElement>(null);

    //editar
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [borrador, setBorrador] = useState<Producto | null>(null);

   //total actualizado
    const { subtotal, iva, total } = useMemo(() => {
        const sub = productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
        return { subtotal: sub, iva: sub * IVA, total: sub * (1 + IVA) };
    }, [productos]);

   //registrar
    const registrar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !cantidad || cantidad <= 0 || !precio || precio <= 0) return;

        setProductos((prev) => [...prev, { id: siguienteId, nombre: nombre.trim(), cantidad, precio }]);
        setSiguienteId((n) => n + 1);
        setNombre('');
        setCantidad(null);
        setPrecio(null);
        nombreRef.current?.focus();
    };

    /* ── Eliminar ── */
    const eliminar = (id: number) => setProductos((prev) => prev.filter((p) => p.id !== id));

    /* ── Editar / Guardar / Cancelar ── */
    const editar = (p: Producto) => {
        setEditandoId(p.id);
        setBorrador({ ...p });
    };
    const cancelar = () => {
        setEditandoId(null);
        setBorrador(null);
    };
    const guardar = () => {
        if (!borrador) return;
        if (!borrador.nombre.trim() || !(borrador.cantidad > 0) || !(borrador.precio > 0)) return;
        setProductos((prev) => prev.map((p) => (p.id === borrador.id ? { ...borrador, nombre: borrador.nombre.trim() } : p)));
        cancelar();
    };
    const teclasEdicion = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            guardar();
        } else if (e.key === 'Escape') {
            cancelar();
        }
    };

    //Plantillas de columnas 
    const enEdicion = (p: Producto) => editandoId === p.id && borrador !== null;

    const nombreBody = (p: Producto) =>
        enEdicion(p) ? <InputText className="w-full" value={borrador!.nombre} onChange={(e) => setBorrador({ ...borrador!, nombre: e.target.value })} onKeyDown={teclasEdicion} autoFocus /> : <span className="font-medium">{p.nombre}</span>;

    const precioBody = (p: Producto) =>
        enEdicion(p) ? (
            <InputNumber value={borrador!.precio} onValueChange={(e) => setBorrador({ ...borrador!, precio: e.value ?? 0 })} mode="currency" currency="MXN" locale="es-MX" min={0.01} inputStyle={{ width: '9rem' }} onKeyDown={teclasEdicion} />
        ) : (
            moneda(p.precio)
        );

    const cantidadBody = (p: Producto) =>
        enEdicion(p) ? <InputNumber value={borrador!.cantidad} onValueChange={(e) => setBorrador({ ...borrador!, cantidad: e.value ?? 0 })} min={1} maxFractionDigits={2} inputStyle={{ width: '5rem', textAlign: 'center' }} onKeyDown={teclasEdicion} /> : p.cantidad;

    // Precio P. = cantidad × precio unitario 
    const totalFilaBody = (p: Producto) => <span className="font-semibold">{moneda(enEdicion(p) ? borrador!.cantidad * borrador!.precio : p.cantidad * p.precio)}</span>;

    const accionesBody = (p: Producto) =>
        enEdicion(p) ? (
            <div className="flex gap-2">
                <Button type="button" icon="pi pi-check" severity="success" size="small" tooltip="Guardar" onClick={guardar} />
                <Button type="button" icon="pi pi-times" severity="secondary" size="small" tooltip="Cancelar" onClick={cancelar} />
            </div>
        ) : (
            <div className="flex gap-2">
                <Button type="button" icon="pi pi-pencil" severity="success" size="small" tooltip="Editar" onClick={() => editar(p)} />
                <Button type="button" icon="pi pi-trash" severity="danger" size="small" tooltip="Eliminar" onClick={() => eliminar(p.id)} />
            </div>
        );

    //
    return (
        <div className="card">
            <h5>PUNTO DE VENTA (POS)</h5>

            {/* Formulario de registro */}
            <form onSubmit={registrar} className="surface-50 border-1 surface-border border-round p-3 mb-3 flex flex-column md:flex-row gap-2 align-items-stretch md:align-items-center">
                <InputText ref={nombreRef} className="flex-grow-1" style={{ flex: 3 }} placeholder="Nombre del producto..." value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="off" />
                <InputNumber className="flex-grow-1" style={{ flex: 1.5 }} placeholder="Cant" value={cantidad} onValueChange={(e) => setCantidad(e.value ?? null)} min={1} maxFractionDigits={2} />
                <InputNumber className="flex-grow-1" style={{ flex: 1.5 }} placeholder="$ Precio U." value={precio} onValueChange={(e) => setPrecio(e.value ?? null)} mode="currency" currency="MXN" locale="es-MX" min={0.01} />
                <Button type="submit" label="Registrar" icon="pi pi-plus" severity="success" disabled={!nombre.trim() || !cantidad || !precio} />
            </form>

            {/* Tabla de productos */}
            <DataTable value={productos} dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} showGridlines size="small" emptyMessage="Aún no hay productos registrados." currentPageReportTemplate="Visualizando {first} a {last} de {totalRecords} productos" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
                <Column header="Cns" style={{ width: '4rem' }} body={(_p, opts) => opts.rowIndex + 1} />
                <Column header="Nombre del Producto" body={nombreBody} />
                <Column header="Precio U." body={precioBody} />
                <Column header="Cant." body={cantidadBody} style={{ width: '7rem' }} bodyClassName="text-center" />
                <Column header="Precio P." body={totalFilaBody} />
                <Column header="Acciones" body={accionesBody} style={{ width: '8rem' }} />
            </DataTable>

            {/* Totales */}
            <div className="surface-50 border-1 surface-border border-round p-3 mt-3 flex flex-wrap justify-content-end align-items-center gap-3">
                <div className="flex align-items-center gap-2">
                    <label htmlFor="subtotal">Subtotal:</label>
                    <InputText id="subtotal" readOnly value={moneda(subtotal)} style={{ width: '9rem' }} />
                </div>
                <div className="flex align-items-center gap-2">
                    <label htmlFor="iva">IVA ({IVA * 100}%):</label>
                    <InputText id="iva" readOnly value={moneda(iva)} style={{ width: '8rem' }} />
                </div>
                <div className="flex align-items-center gap-2">
                    <label htmlFor="total" className="font-bold">
                        Total:
                    </label>
                    <InputText id="total" readOnly value={moneda(total)} className="font-bold" style={{ width: '9rem' }} />
                </div>
            </div>
        </div>
    );
};

export default PuntoDeVenta;
